import { USA_TRADE_CONFIG } from "./config.js";
import { COUNTRY_CODE_MAP } from "./countryCodes.js";

export const USA_ENGINE = {
    name: "USA",

    getImportingCountry() {
        return "USA";
    },

    getTradeConfig() {
        return USA_TRADE_CONFIG;
    },

    getRateColumn(countryName, item) {
        // 🛡️ SAFETY GUARD — this was missing
        if (!item) return "general";
    
        const trade = this.getTradeConfig();
    
        // 1️⃣ Column 2 always wins
        if (trade.column2Countries.includes(countryName)) {
            return "other";
        }
    
        // 2️⃣ Check if HTS item contains country code in SPECIAL column
        const code = COUNTRY_CODE_MAP[countryName];
        if (!code) return "general";
    
        // 🛡️ EXTRA SAFE ACCESS
        const specialText = item?.special || "";
    
        // look for (AU) or AU or ,AU, etc
        const regex = new RegExp(`\\b${code}\\b`, "i");
    
        if (regex.test(specialText)) {
            return "special";
        }
    
        // 3️⃣ default MFN
        return "general";
    },

    // ⭐ PRIVATE — inherit rate from parent nodes
    inheritRate(item, rateField, findParentWithRateFn) {
        const parent = findParentWithRateFn(item, rateField);

        if (!parent) return null;

        return parent[rateField] || null;
    },

    // ⭐ MAIN ENGINE FUNCTION (UI will call ONLY this)
    getDutyRate(item, exportingCountry, findParentWithRateFn) {

        // 🛡️ SAFETY GUARD (VERY IMPORTANT)
        if (!item) {
            return {
                value: "N/A",
                inherited: false,
                column: "general"
            };
        }
    
        const rateField = this.getRateColumn(exportingCountry, item);
    
        let rate = item[rateField];
    
        if (!rate || rate === "" || rate === "N/A") {
            const inheritedRate = this.inheritRate(item, rateField, findParentWithRateFn);
    
            if (inheritedRate) {
                return {
                    value: inheritedRate,
                    inherited: true,
                    column: rateField
                };
            }
    
            return {
                value: "N/A",
                inherited: false,
                column: rateField
            };
        }
    
        return {
            value: rate,
            inherited: false,
            column: rateField
        };
    }
};