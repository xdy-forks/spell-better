/*
22-Dec-2020     0.5.1: Incorporate Inventory+ (Felix Müller aka syl3r86) and implement its category and drag-and-drop tools  
                Have to copy code because overrides are too difficult
23-Dec-2020     0.5.1: - Have to null out flags.spell-better during development     
24-Dec-2020     0.5.1i: filterSpells(): loops over legal filterSets in the passed spell filters    
                0.5.1k: Check the flags as well for inclusion     
27-Dec-2020     0.5.1s: categorizeSpells: Copy over slots etc from real sections  
29-Dec-2020     0.5.1t: Only save the customCategories and merge with the standardCategories (then we don't have to upgrade standard categories)              
                Delete standardCategories from the saved ones
*/

import {SpellBetterCharacterSheet} from "./SpellBetter.js";
import {Category} from "./Category.js";
import { MODULE_ID, SPELL_BETTER } from './constants.js';

export class InventoryPlusForSpells {
    constructor(actor) {
        this.actor = actor;
        this.initCategories();
    }

    initCategories() {
        //Saved custom categories
        const savedCategories = this.actor.getFlag(MODULE_ID, SPELL_BETTER.categories_key);
        const savedCategoriesVersion = this.actor.getFlag(MODULE_ID, SPELL_BETTER.categoriesVersion_key);
        //Upgrade the saved categories if necessary (compare savedCategoriesVersion)
        if (SPELL_BETTER.categoriesVersion !== (savedCategoriesVersion ?? MODULE_VERSION)) {

        } else if (savedCategories) {
            //Remove standard categories from the saved ones
            for (const [key, categoryData] of Object.entries(savedCategories)) {
                if (Object.keys(SPELL_BETTER.standardCategories).includes(key)) {
                    delete savedCategories[key];
                }
            }
        }
        const customCategories = savedCategories ?? {};

        //Merge standard and saved categories
        this.allCategories = mergeObject(customCategories, SPELL_BETTER.standardCategories);

        this.applySortKey();
    }

    
    applySortKey() {
        let sortedCategories = {};

        let keys = Object.keys(this.allCategories);
        keys.sort((a, b) => {
            return this.allCategories[a].order - this.allCategories[b].order;
        });
        for (let key of keys) {
            sortedCategories[key] = this.allCategories[key];
        }
        this.allCategories = sortedCategories;
    }

    static filterSpells(spells, appliedFilterSets) {
        const labelFilterSets = Object.keys(SPELL_BETTER.labelFilterSets);
        return spells.filter(spell => {
            const {labels, flags} = spell;  //include spell for debugging
            let includeSpell = true;
            //0.5.1i: Instead of working off SPELL_BETTER.filters, just use the available filterSets
            //LabelFilters are gainst standard things (levels, schools...) that are in the labels

            const appliedLabelFilterSets = appliedFilterSets.filter(afs => labelFilterSets.includes(afs.filterSet));
            for (const afs of appliedLabelFilterSets) {
                const matches = afs.filters?.filter(f =>  Object.values(labels).includes(f));
                includeSpell = includeSpell && (matches.length > 0);
                if (!includeSpell) break;
            }//end for labelFilters

            //Apply the flagFilters only if the spell is already included
            if (includeSpell) {
                const appliedFlagFilterSets =  appliedFilterSets.filter(afs => !labelFilterSets.includes(afs.filterSet));
                //If we have flagFilterSets, but no flags, might be an exclude (indicated by empty filter list)
                //so we have to process
                for (const afs of appliedFlagFilterSets) {
                    //0.5.1: Just a single flag per flag label for now
                    const flagForFilterSet =  (flags && flags[MODULE_ID]) ? flags[MODULE_ID][afs.filterSet] : null;
                    //Possibilities:
                    //flagForFilterSet is null AND afs.filters is [] => INCLUDE
                    //flagForFilterSet exists and is included in afs.filters => INCLUDE
                    //flagForFilterSet exists and afs.filters doesn't include the flag => EXCLUDE
                    const includedInFilterSet = (!flagForFilterSet && !afs.filters?.length) 
                                                || (flagForFilterSet && afs.filters?.includes(flagForFilterSet))
                    includeSpell = includeSpell && includedInFilterSet;
                    if (!includeSpell) break;
                }//end for flagFilters
            }//end if includeSpell
            return includeSpell;
        });
    }

    categorizeSpells(spellbook) {
        let categories = duplicate(this.allCategories);

        //Categorize spells for display; the same spell could appear in MULTIPLE areas
        //TODO: Would probably be more efficient to make the outer loop the spells and the inner loop the categories, since most spells will be in one category        
        for (const [category, value] of Object.entries(categories) ) {
            categories[category].spells = [];
            for (const section of spellbook) {
//FIXME: Custom categories badly defined will not have filterSets                
                const filteredSpells = InventoryPlusForSpells.filterSpells(section.spells, value.filterSets);
                categories[category].spells.push(...filteredSpells);

                //Copy the standard level-based stats over
                if (section.prop && (section.prop === value.prop)) {
                    const levelStats = {
                        canCreate : section.canCreate,
                        canPrepare : section.canPrepare,
                        slots: section.slots,
                        uses: section.uses,
                        usesSlots: section.usesSlots
                    }
                    mergeObject(categories[category], levelStats);
                }
            }
            //Now sort spells within categories - should make this configurable
            categories[category].spells.sort((a, b) => {
                return a.sort - b.sort;
            });

        }
        return categories;
    }

    getTemplateItemData(category) {
        const customCategory = this.allCategories[category];
        let templateItemData = {name: game.i18n.localize(customCategory?.label), type: "spell" }
        let templateItemDataData = duplicate(customCategory?.templateItemData);
        if (templateItemDataData) {
            mergeObject(templateItemData, {data: templateItemDataData});
        }
        const templateFlags = customCategory?.templateFlags;
        return {templateItemData, templateFlags};
    }

    async createNewCategoryDialog() {
        new Category(null, {}, this).render(true);
    }

    async removeCategory(category) {
        let changedItems = [];
        for (let spell of this.actor.data.items.filter(i => i.type === "spell")) {
            let type = InventoryPlusForSpells.getSpellCategory(spell);
            if (type === category) {
                const unsetFlag =  `-=flags.${MODULE_ID}`;
                const changedItem = {_id: spell.id}
                changedItem[unsetFlag] = null;
                changedItems.push(changedItem);
            }
        }
        await this.actor.updateEmbeddedEntity('OwnedItem', changedItems);

        delete this.allCategories[category];
        let deleteKey = `-=${category}`
        this.actor.setFlag(MODULE_ID,  SPELL_BETTER.categories_key, { [deleteKey]:null });
    }


    static getSpellCategory(spell) {
        const spellFlags = spell.flags[MODULE_ID];
        const spellCategory = spellFlags ? spellFlags.category : null;
        return spellCategory;
    }

    changeCategoryOrder(movedType, up) {
        let targetType = movedType;
        let currentSortFlag = 0;
        if(!up) currentSortFlag = 999999999;
        for (let id in this.allCategories) {
            let currentCategory = this.allCategories[id];
            if (up) {
                if (id !== movedType && currentCategory.order < this.allCategories[movedType].order && currentCategory.order > currentSortFlag) {
                    targetType = id;
                    currentSortFlag = currentCategory.order;
                }
            } else {
                if (id !== movedType && currentCategory.order > this.allCategories[movedType].order && currentCategory.order < currentSortFlag) {
                    targetType = id;
                    currentSortFlag = currentCategory.order;
                }
            }
        } 

        if (movedType !== targetType) {
            let oldMovedSortFlag = this.allCategories[movedType].order;
            let newMovedSortFlag = currentSortFlag;

            this.allCategories[movedType].order = newMovedSortFlag;
            this.allCategories[targetType].order = oldMovedSortFlag;
            this.applySortKey();
            this.saveCategories();
        }
    }


    getHighestSortFlag() {
        let highest = 0;

        for (let id in this.allCategories) {
            let cat = this.allCategories[id];
            if (cat.order > highest) {
                highest = cat.order;
            }
        }

        return highest;
    }

    getLowestSortFlag() {
        let lowest = 999999999;

        for (let id in this.allCategories) {
            let cat = this.allCategories[id];
            if (cat.order < lowest) {
                lowest = cat.order;
            }
        }

        return lowest;
    }

    generateCategoryId() {
        let id = '';
        let iterations = 100;
        do {
            id = Math.random().toString(36).substring(7);
            iterations--;
        } while (this.allCategories[id] !== undefined && iterations > 0 && id.length>=5)

        return id;
    }


    async saveCategories() {
        //Save only the custom categories - probably a better way to filter this
//FIXME: Maybe only pass the custom categories except when we filter by categories        
        const customCategories = duplicate(this.allCategories);
        for (const key in customCategories) {
            if (!customCategories[key].isCustom) {delete customCategories[key];}
        }
    
        await this.actor.setFlag(MODULE_ID, SPELL_BETTER.categories_key, null);
        await this.actor.setFlag(MODULE_ID,  SPELL_BETTER.categories_key, customCategories);
        //0.5.1s: Save the categoryVersion (which means we need to do any upgrading on read)
        await this.actor.setFlag(MODULE_ID, SPELL_BETTER.categoriesVersion_key, SPELL_BETTER.categoriesVersion);
    }
}//end InventoryPlusForSpells
