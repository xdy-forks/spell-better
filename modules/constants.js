/*
29-Dec-2020 0.5.1:  Add isCustom flag to added categories
30-Dec-2020 0.5.1x: OPtion to not display standard categories with no spells
2-Jan-2021  0.5.1ad: Add choice to labelFilterSets to make using selectOptions easier - they are converted into property names
                        (if not present then use filter value instead)
3-Jan-2021  0.5.2a: Switch labelFilterSets and standard categories to a format more consistent with foundry.js#selectOptions
            0.5.2b: SPELL_BETTER.standardCategories: Separate labelFilters and categoryFilters; add showOnlyNoCategory
4-Jan-2021  0.5.3: Substitute for the regular spellbook tab on supported sheets      
5-Jan-2021  0.5.3e: Use viewOrSpellbook choice      
*/


export const MODULE_ID = 'spell-better';
export const MODULE_VERSION = "0.5.2";

//SPell Better 0.5.0: The filter lists have to be spelled out to match what is in the internal labels
export const SPELL_BETTER = {
    limitActionsToCantrips : 'limit-actions-to-cantrips',
    showIconsOnInventoryList : 'show-icons-on-inventory-list',
    expandedLimited : 'expanded-limited',
    hideCategoryWithNoSpells : "hide-category-with-no-spells",
    substituteForSpellbook: "substitute-for-spellbook",
    labelFilterSets :  {
        castingTimes : {
            _1_Action : {label: "1 Action", name: "DND5E.Action"},         
            _1_Bonus_Action : {label: "1 Bonus Action", name: "DND5E.BonusAction"},      
            _1_Reaction: {label: "1 Reaction", name: "DND5E.Reaction"},                      
            _1_M: {label: "1 M", name: "SPELL_BETTER._1Minute"},
            _10_M: {label: "10 M",name: "SPELL_BETTER._10Minutes"},
            _1_H: {label: "1 H", name: "SPELL_BETTER._1Hour"}
        },
        otherConcentration : {concentration: {label: "concentration",name: "DND5E.Concentration"}},
        otherRitual : {ritual: {label: "ritual",name: "DND5E.Ritual"}},
        otherPrepared : {prepared: {label: "prepared",name: "DND5E.Prepared"}},
        durations : {
            instantaneous: {label: "Instantaneous", name: "DND5E.TimeInst"},                         
            _1_Round: {label: "1 Rounds",name: "SPELL_BETTER._1Round"},
            _1_Minute: {label: "1 Minutes", name: "SPELL_BETTER._1Minute"},
            _10_Minutes: {label: "10 Minutes",name: "SPELL_BETTER._10Minutes"},
            _1_Hours: {label: "1 Hours", name: "SPELL_BETTER._1Hour"}
        },
        schools : {
            abjuration: {label: "Abjuration", name: "DND5E.SchoolAbj"},
            conjuration: {label: "Conjuration", name: "DND5E.SchoolCon"},
            divination: {label: "Divination", name: "DND5E.SchoolDiv"},
            enchantment: {label: "Enchantment", name: "DND5E.SchoolEnc"},
            evocation: {label: "Evocation", name: "DND5E.SchoolEvo"},
            illusion: {label: "Illusion", name: "DND5E.SchoolIll"},
            necromancy: {label: "Necromancy", name: "DND5E.SchoolNec"},
            transmutation: {label: "Transmutation", name: "DND5E.SchoolTrs"}
        },
        levels : {
            cantrip: {label: "Cantrip", name: "DND5E.SpellLevel0"},
            "_1st_Level": {label: "1st Level", name: "SPELL_BETTER.SpellLevel1"},
            "_2nd_Level": {label: "2nd Level", name: "SPELL_BETTER.SpellLevel2"},
            "_3rd_Level": {label: "3rd Level", name: "SPELL_BETTER.SpellLevel3"},
            "_4th_Level": {label: "4th Level", name: "SPELL_BETTER.SpellLevel4"},
            "_5th_Level": {label: "5th Level", name: "SPELL_BETTER.SpellLevel5"},
            "_6th_Level": {label: "6th Level", name: "SPELL_BETTER.SpellLevel6"},
            "_7th_Level": {label: "7th Level", name: "SPELL_BETTER.SpellLevel7"},
            "_8th_Level": {label: "8th Level", name: "SPELL_BETTER.SpellLevel8"},
            "_9th_Level": {label: "9th Level",  name: "SPELL_BETTER.SpellLevel9"}
        }
    },
    categoriesVersion_key : "categoriesVersion",
    categoriesVersion : MODULE_VERSION, 
    categories_key : "categories",
    standardCategories : { 
        //.prop is needed for now for display     
        spell0: { label: "DND5E.SpellLevel0",
                templateItemData: {level: 0},
                labelFilterSets: {
                    levels: ["Cantrip"]
                }, showAnyCategory: false,
                /* Will be overridden by actual spell level stats */
                prop: "spell0", canCreate: true, canPrepare: false, slots: "&infin;", uses: "&infin;", usesSlots: false,
                order: 0, type: "spell",  isCollapsed: true },
        spell1: { label: "SPELL_BETTER.SpellLevel1", 
                templateItemData: {level: 1},
                labelFilterSets: {
                    levels: ["1st Level"]
                },         showAnyCategory: false,
                prop: "spell1", canCreate: true, canPrepare: true, slots: "4", uses: "4", usesSlots: true,    
                order: 10, type: "spell",  isCollapsed: false },     
        spell2: { label: "SPELL_BETTER.SpellLevel2", 
                templateItemData: {level: 2},
                labelFilterSets: {
                    levels: ["2nd Level"]
                },          showAnyCategory: false,   
                prop: "spell2", canCreate: true, canPrepare: true, slots: "3", uses: "3", usesSlots: true,       
                order: 20, type: "spell",  isCollapsed: false },
        spell3: { label: "SPELL_BETTER.SpellLevel3", 
                templateItemData: {level: 3},
                labelFilterSets: {
                    levels: ["3rd Level"],
                },   showAnyCategory: false,
                prop: "spell3", canCreate: true, canPrepare: true, slots: "3", uses: "3", usesSlots: true,                
                order: 30,  type: "spell",  isCollapsed: false },
        spell4: { label: "SPELL_BETTER.SpellLevel4", 
                templateItemData: {level: 4},
                labelFilterSets: {
                    levels: ["4th Level"]
                },       showAnyCategory: false,
                prop: "spell4", canCreate: true, canPrepare: true, slots: "3", uses: "3", usesSlots: true,                
                order: 40,  type: "spell",  isCollapsed: false },          
        spell5: { label: "SPELL_BETTER.SpellLevel5", 
                templateItemData: {level: 5},
                labelFilterSets: {
                    levels: ["5th Level"]
                },       showAnyCategory: false,
                prop: "spell5", canCreate: true, canPrepare: true, slots: "3", uses: "3", usesSlots: true,                
                order: 50,  type: "spell",  isCollapsed: false },
        spell6: { label: "SPELL_BETTER.SpellLevel6",
                templateItemData: {level: 6},
                labelFilterSets: {
                    levels: ["6th Level"]
                },        showAnyCategory: false,         
                prop: "spell6", canCreate: true, canPrepare: true, slots: "1", uses: "1", usesSlots: true,                
                order: 60,  type: "spell",  isCollapsed: false },
        spell7: { label: "SPELL_BETTER.SpellLevel7", 
                templateItemData: {level: 7},
                labelFilterSets: {
                    levels: ["7th Level"]
                },        showAnyCategory: false,      
                prop: "spell7", canCreate: true, canPrepare: true, slots: "1", uses: "1", usesSlots: true,                
                order: 70,  type: "spell",  isCollapsed: false },
        spell8: { label: "SPELL_BETTER.SpellLevel8", 
                templateItemData: {level: 8},
                labelFilterSets: {
                    levels: ["8th Level"]
                },        showAnyCategory: false,         
                prop: "spell8", canCreate: true, canPrepare: true, slots: "1", uses: "1", usesSlots: true,                
                order: 80,  type: "spell",  isCollapsed: false },
        spell9: { label: "SPELL_BETTER.SpellLevel9", 
                templateItemData: {level: 9},
                labelFilterSets: {
                    levels: ["9th Level"]
                },        showAnyCategory: false,        
                prop: "spell9", canCreate: true, canPrepare: true, slots: "1", uses: "1", usesSlots: true,                
                order: 90,  type: "spell",  isCollapsed: false },
        rituals: { label: "SPELL_BETTER.Rituals", isCustom: true,
                templateItemData: {level: 1},
                labelFilterSets: {
                    otherRitual: ["ritual"]
                },         showAnyCategory: false,
                canCreate: false, canPrepare : false,           
                order: 900, usesSlots: false, type: "spell",  isCollapsed: true },                 
        wanted4: { label: "Wanted (4th)", isCustom: true,
                templateItemData: {level: 9}, templateFlags: {"category": "wanted"},
                labelFilterSets: {
                    levels: ["4th Level"]
                },
                flagFilterSets : {
                    category: ["wanted"]
                },
                canCreate: false, canPrepare : false,           
                order: 999, usesSlots: false, type: "spell",  isCollapsed: true },                                                                                                                                                       
        wanted: { label: "SPELL_BETTER.Category.Wanted", isCustom: true, 
                templateItemData: {level: 9}, templateFlags: {"category": "wanted"},
                labelFilterSets: {}, viewOrSpellbook: "spellbook", 
                canCreate: true, canPrepare : false,           
                order: 1000, usesSlots: false, type: "spell",  isCollapsed: true },
        //ALL category to make sure setting a flag doesn't hide a spell completely                
        all:    {label: "SPELL_BETTER.Category.All", 
                templateItemData: {level: 9},
                labelFilterSets: {},  showAnyCategory: true,   
                canCreate: true, canPrepare : true,                     
                order: 9000, usesSlots: false, type: "spell",  isCollapsed: true }
    }
}
