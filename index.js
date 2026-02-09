import { USA_ENGINE } from "./countries/usa/engine.js";

const COUNTRY_ENGINE = USA_ENGINE;

    const COPY_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="14" height="14" aria-hidden="true">
        <path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l133.5 0c4.2 0 8.3 1.7 11.3 4.7l58.5 58.5c3 3 4.7 7.1 4.7 11.3L400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-197.5c0-17-6.7-33.3-18.7-45.3L370.7 18.7C358.7 6.7 342.5 0 325.5 0L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-48 0 0 16c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l16 0 0-48-16 0z"/>
    </svg>
    `;

    const CHECK_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14" aria-hidden="true">
        <path d="M173.9 439.4l-166.4-166.4c-9.4-9.4-9.4-24.6 0-33.9l33.9-33.9c9.4-9.4 24.6-9.4 33.9 0L192 312.7 436.7 68c9.4-9.4 24.6-9.4 33.9 0l33.9 33.9c9.4 9.4 9.4 24.6 0 33.9L210 439.4c-9.4 9.4-24.6 9.4-36.1 0z"/>
    </svg>
    `;

    const ICON_PLUS = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 16 16" fill="currentColor"
        class="hts-toggle-icon">
    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
    </svg>`;

    const ICON_MINUS = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 16 16" fill="currentColor"
        class="hts-toggle-icon">
    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm9 8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5"/>
    </svg>`;

    const CBP_APPAREL_PDF =
    "https://www.cbp.gov/sites/default/files/assets/documents/2020-Feb/ICP-Apparel-Terminology-2008-Final.pdf";


    let isResetting = false;

        let masterData = [];
        let allCountries = [];
        let highlightEnabled = false;
        let categoryMenuOpen = false;
        let suppressCategoryHover = false;
        let openFilterMenu = null;
        let openInfoIcon = null;
        let lockedInfoIcon = null;


// Fabric classification HTML moved to JS so it can be reused and localized
const FABRIC_CLASSIFICATION_HTML = `
<div class="fabric-classification">

    <input
        type="text"
        class="fabric-search"
        placeholder="Search fabric rules..."
        oninput="filterFabricRules(this)"
    />

    <h3>Fabric Classification Rules</h3>

    <ul class="fabric-rule-list">
        <li><strong>Artificial Fibers:</strong> Chemically transformed natural polymers (viscose, cupro, acetate).</li>
        <li><strong>Coated/Covered with Rubber or Plastic:</strong> Fabrics impregnated, coated, covered, or laminated with plastics or rubber.</li>
        <li><strong>Cotton:</strong> Natural vegetable fibers of the genus <em>Gossypium</em>.</li>
        <li><strong>Fine Animal Hair:</strong> Hair of alpaca, llama, vicuna, camel, yak, Angora, etc.</li>
        <li><strong>Flax Fibers:</strong> Linen fiber; apparel with ≥36% by weight.</li>
        <li><strong>Man-Made Fibers:</strong> Manufactured organic polymer fibers.</li>
        <li><strong>Metallized Yarn:</strong> Any metal content → other textile material.</li>
        <li><strong>Other Textile Materials:</strong> Basket category; linen (835).</li>
        <li><strong>Silk or Silk Waste:</strong> Natural fibers from silkworm cocoons.</li>
        <li><strong>Subject to Cotton Restraints (334):</strong> Cotton ≥50%.</li>
        <li><strong>Subject to Man-Made Fiber Restraints (634):</strong> MMF ≥50%.</li>
        <li><strong>Subject to Wool Restraints (434):</strong> Wool >17%.</li>
        <li><strong>Synthetic Fibers:</strong> Polymerization fibers (nylon, polyester).</li>
        <li><strong>Vegetable Fibers:</strong> Flax, hemp, ramie, abaca.</li>
        <li><strong>Wool:</strong> Natural fiber from sheep or lambs.</li>
    </ul>
</div>
`;


// Inject fabric info into tooltip container when present
        try {
                const fabricTip = document.getElementById('fabricInfoTooltip');
                if (fabricTip) fabricTip.innerHTML = FABRIC_CLASSIFICATION_HTML;
        } catch (e) { /* ignore during load */ }

        function getFilterLabel(filterType, value) {
            const items = FILTER_DATA && FILTER_DATA[filterType];
            if (!items || !value) return value || 'All';
            const found = items.find(i => i.value === value);
            return found ? found.label : value;
        }


        const MAIN_CATEGORY_MAP = {
            "Tops": [
                "T-Shirts","Shirts", "Shirt-Blouses", "Blouses",
                "Tops", "Tank Tops", "Singlets", "Bodyshirts", "Undershirts"
            ],
            "Bottomwear": [
                "Trousers",
                "Shorts",
                "Skirts",
                "Divided Skirts",
                "Breeches",
                "Ski/Snowboard Pants"
            ],
            "Dresses & One-Piece Garments": [
                "Dresses", "Jumpsuits", "One-Piece Playsuits",
                "Sunsuits", "Washsuits"
            ],
            "Outerwear": [
                "Anoraks", "Windbreakers", "Jackets", "Blazers",
                "Suit-Type Jackets", "Coats", "Overcoats",
                "Carcoats", "Capes", "Cloaks",
                "Ski-Jackets", "Waistcoats (Vests)"
            ],
            "Suits & Sets": [
                "Ensembles", "Suits", "Track Suits", "Ski-Suits"
            ],
            "Knitwear & Layering": [
                "Sweaters", "Sweatshirts", "Jumpers",
                "Pullovers", "Bodysuits"
            ],
            "Sleepwear & Loungewear": [
                "Pajamas", "Nightshirts",
                "Dressing Gowns", "Bathrobes",
                "Negligees", "Night Dresses"
            ],
            "Underwear & Intimates": [
                "Briefs", "Panties", "Underpants",
                "Slips", "Petticoats", "Brassieres",
                "Corsets", "Girdles", "Garters"
            ],
            "Hosiery & Legwear": [
                "Hosiery", "Panty Hose",
                "Tights", "Stockings", "Socks"
            ],
            "Swimwear": ["Swimwear"],
            "Babies & Infant Wear": [
                        "Blanket Sleepers",
                        "Blouses",
                        "Breeches",
                        "Dresses",
                        "Playsuits",
                        "Pullovers",
                        "Sets",
                        "Shirts",
                        "Shorts",
                        "Singlets",
                        "Socks and Booties",
                        "Sunsuits",
                        "Sweaters",
                        "Sweatshirts",
                        "Trousers",
                        "T-shirts",
                        "Waistcoats",
                        "Washsuits"
                    ],
            "Overalls & Coveralls": [
                "Bib and Brace Overalls", "Overalls", "Coveralls"
            ],
            "Disposable & Specialised Apparel": [
                "Nonwoven Disposable Apparel",
                "Surgical or Isolation Gowns",
                "Plastic or Rubber Coated Garments",
                "Disposable Briefs and Panties"
            ],
            "Accessories": [
                "Ties", "Bow Ties", "Cravats",
                "Suspenders", "Braces", "Scarves",
                "Shawls", "Mufflers", "Veils",
                "Gloves", "Mittens", "Mitts",
                "Headbands", "Handkerchiefs",
                "Ponytail Holders", "Mantillas"
            ]
        };

        const CATEGORY_KEYWORDS = {
                "Overcoats": ["overcoats"],
                "Carcoats": ["carcoats"],
                "Capes": ["capes"],
                "Cloaks": ["cloaks"],
                "Anoraks": ["anoraks"],
                "Ski-Jackets": ["ski jackets", "ski-jackets"],
                "Windbreakers": ["windbreakers"],
                "Coats": ["Coats"],
                "Jackets": ["jackets"],

                "Suits": ["suits"],
                "Ensembles": ["ensembles"],
                "Suit-Type Jackets": ["suit-type jackets", "suit type jackets"],
                "Blazers": ["blazers"],

                "Trousers": ["trousers"],
                "Bib and Brace Overalls": ["bib and brace overalls"],
                "Breeches": ["breeches"],
                "Shorts": ["shorts"],

                "Dresses": ["dresses"],
                "Skirts": ["skirts"],
                "Divided Skirts": ["divided skirts"],

                "Blouses": ["blouses"],
                "Shirts": ["Shirts","shirts"],
                "Shirt-Blouses": ["shirt blouses", "shirt-blouses"],
                "Undershirts": ["undershirts"],

                "Underpants": ["underpants"],
                "Briefs": ["briefs"],
                "Panties": ["panties"],

                "Nightshirts": ["nightshirts"],
                "Pajamas": ["pajamas", "pyjamas"],
                "Night Dresses": ["night dresses"],
                "Negligees": ["negligees"],
                "Bathrobes": ["bathrobes"],
                "Dressing Gowns": ["dressing gowns"],
                "Slips": ["slips"],
                "Petticoats": ["petticoats"],

                "T-Shirts": ["t-shirts","T-shirts","t shirts"],
                "Singlets": ["singlets"],
                "Tank Tops": ["tank tops"],
                "Tops": ["tops"],

                "Sweaters": ["sweaters"],
                "Pullovers": ["pullovers","Pullovers"],
                "Sweatshirts": ["sweatshirts"],
                "Waistcoats (Vests)": ["waistcoats", "vests"],
                "Track Suits": ["track suits", "tracksuits"],
                "Ski-Suits": ["ski suits", "ski-suits"],
                "Ski/Snowboard Pants": ["Ski/snowboard pants","ski pants", "snowboard pants", "ski/snowboard pants"],
                "Swimwear": ["swimwear", "swimsuits", "bathing suits"],

                "Overalls": ["overalls"],
                "Coveralls": ["coveralls"],
                "Jumpers": ["jumpers"],
                "Bodysuits": ["bodysuits"],
                "Bodyshirts": ["bodyshirts"],
                "Sunsuits": ["sunsuits"],
                "Washsuits": ["wash suits", "washsuits"],
                "One-Piece Playsuits": ["one-piece playsuits ","playsuits","playsuits","one piece","one piece playsuit","one piece playsuits"],
                "Jumpsuits": ["jumpsuits"],

                "Panty Hose": ["panty hose"],
                "Tights": ["tights"],
                "Stockings": ["stockings"],
                "Socks": ["socks"],
                "Hosiery": ["hosiery"],
                "Babies Garments": [
                    "blanket sleepers (239)",
                    "blouses",
                    "breeches",
                    "dresses",
                    "playsuits",
                    "pullovers",
                    "sets",
                    "shirts",
                    "shorts",
                    "singlets",
                    "socks and booties",
                    "sunsuits",
                    "sweaters",
                    "sweatshirts",
                    "trousers",
                    "t-shirts",
                    "waistcoats",
                    "washsuits"
                    ],

                "Gloves": ["gloves"],
                "Mittens": ["mittens"],
                "Mitts": ["mitts"],

                "Shawls": ["shawls"],
                "Scarves": ["scarves"],
                "Mufflers": ["mufflers"],
                "Mantillas": ["mantillas"],
                "Veils": ["veils"],

                "Ties": ["ties"],
                "Bow Ties": ["bow ties"],
                "Cravats": ["cravats"],

                "Headbands": ["headbands"],
                "Ponytail Holders": ["ponytail holders"],

                "Nonwoven Disposable Apparel": ["nonwoven", "disposable apparel"],
                "Surgical or Isolation Gowns": ["surgical gowns", "isolation gowns"],
                "Plastic or Rubber Coated Garments": [ "rubber or plastics", "plastics or rubber", "plastics or rubber coated garments", "plastics", "rubber coated garments"],
                "Disposable Briefs and Panties": ["disposable briefs", "disposable panties"],

                "Brassieres": ["brassieres"],
                "Girdles": ["girdles"],
                "Corsets": ["corsets"],
                "Braces": ["braces"],
                "Suspenders": ["suspenders"],
                "Garters": ["garters"],

                "Handkerchiefs": ["handkerchiefs"]
            };

            const GENDER_TERMS = {
                "Men": ["men"],
                "Women": ["women", "ladies"],
                "Boys": ["boys"],
                "Girls": ["girls"],
                "Babies": ["babies", "infants"]
            };

            const MATERIAL_NEUTRAL_CATEGORIES = new Set([
                "brassieres",
                "girdles",
                "corsets",
                "braces",
                "suspenders",
                "garters"
                ]);

                const GENDER_NEUTRAL_CATEGORIES = new Set([
                "brassieres",
                "girdles",
                "corsets",
                "garters"
                ]);

                
                const CATEGORY_ALERT_RULES = {
                    "Babies & Infant Wear ": {
                        keywords: ["Babies' garments", "baby garments", "infants"],
                        message: `
                            <b>Babies’ Garments Notification</b>
                            <ul>
                               <li> Any garment intended for babies up to 86 cm height is always classified under HTS 6209, even if it resembles adult clothing.</li>
                            </ul>
                        `
                    },

                    "suit-type jackets": {
                    keywords: ["suit-type jackets", "business jackets", "formal jackets"],
                    message: `
                        <b>Suit-Type Jackets Notification</b>
                        <ul>
                            <li><b>Applicable headings</b>
                                <ul>
                                    <li>6103 / 6104 – Knit</li>
                                    <li>6203 / 6204 – Woven</li>
                                </ul>
                            </li>
                            <li>Tailored garments intended for business or social wear requiring formality</li>
                            <li>Full frontal opening with no closure or with closures other than a zipper</li>
                            <li>Sleeves of any length</li>
                            <li>Three or more body panels (excluding sleeves)</li>
                            <li>Includes two front panels sewn lengthwise</li>
                            <li>Does not extend below the mid-thigh</li>
                            <li>Not designed to be worn over another coat, jacket, or blazer</li>
                        </ul>
                    `
                },
                "ensembles": {
                keywords: ["ensembles", "garment ensembles", "clothing sets"],
                message: `
                    <b>Ensemble Classification Rules</b>
                    <ul>
                        <li>
                            An ensemble (HS 6103, 6104, 6203, 6204) is a retail set of garments made from
                            identical fabric, excluding suits, tracksuits, and ski-suits
                        </li>
                        <li>
                            <b>Upper garment</b>
                            <ul>
                                <li>One upper-body garment</li>
                                <li>A waistcoat or pullover may form a second upper piece in specific sets</li>
                            </ul>
                        </li>
                        <li>
                            <b>Lower garment(s)</b>
                            <ul>
                                <li>
                                    One or two items:
                                    trousers, bib & brace overalls, breeches, shorts, skirt, or divided skirt
                                </li>
                            </ul>
                        </li>
                        <li>
                            <b>Uniformity required</b>
                            <ul>
                                <li>Matching construction</li>
                                <li>Style</li>
                                <li>Colour</li>
                                <li>Composition</li>
                                <li>Compatible sizing</li>
                            </ul>
                        </li>
                        <li>
                            Must be reported as <b>separate articles</b> under individual 10-digit suffixes
                            (e.g., shirt, trousers, jacket reported separately)
                        </li>
                        <li>
                            All criteria must be met for classification as an ensemble
                        </li>
                    </ul>
                `
            },


    "suits": {
        keywords: ["suits","Suits"],
        message: `
        <b>Suit Classification Alert:</b>
        
        <ul>
        <li>A “suit” (HS 6103, 6104, 6203, 6204) must consist of 2 or 3 matching garments made from identical outer fabric.
        Reported as a single unit:</li>
        <li>Upper garment: One suit coat/jacket with 4 or more body panels (excluding sleeves)</li>
        <li>Lower garment:</li>
            <ul>
                <li>Men/Boys: Trousers, breeches, or shorts</li>
                <li>Women/Girls: Trousers, breeches, shorts, skirt or divided skirt.</li>
            </ul>
        <li>Optional tailored waistcoat: Front must match the suit fabric; back must match the jacket lining</li>
        <li>Uniformity required: Same fabric construction, colour, composition, style, and compatible size</li>
        <li>Included styles: Morning dress, evening dress (tailcoats), and dinner jacket suits</li>
        <li>All criteria must be met for classification as a suit.</li>
        </ul>
                `
            },

    "track suits": {
        keywords: [
            "track suits",
            "tracksuits",
            "ski-suits",
        ],
        message: `
        <b>Track Suits &amp; Ski-Suits Classification Alert:</b>
        <ul>
            <li>Track Suits: Coordinated sets consisting of a jacket and trousers.</li>
            <li>Ski-Suits: Garments principally intended for skiing, including:</li>
            <li>Ski Overall: One-piece garment covering the whole body</li>
            <li>Ski Ensemble: 2–3 piece set with a jacket-type garment (anorak/windbreaker) and one lower garment</li>
            <li>Colour rule: Components must have the same texture, style, and composition; colour matching is not required.</li>
            <li>Criteria must be met for correct classification.</li>
        </ul>
                `
            },
        };


         const categoryDescriptions = {
            "t-shirts": "Underwear-style garments made of lightweight knit fabric (not exceeding 200g/m²) with short, close-fitting hemmed sleeves and a hemmed bottom. They must not have collars, openings at the neckline, or drawstrings",
            "shirts": "Shirts (Men's and Boys'): Outer garments designed for indoor/outdoor attire that extend from the neck to the waist or below. Knit: Must have a full or partial opening at the neckline and sleeves of any length. Woven: Specifically designed to close left over right on the front opening",
            "shirt-blouses":"Blouses, Shirts, and Shirt-Blouses (Women's and Girls'): Garments designed to cover the upper body from the neck to at or below the waist. Woven: May include overblouses that extend to the mid-thigh. Exclusions: Knit blouses and woven garments under heading 6206 generally exclude those with pockets below the waist or rib-knit waistbands",
            "blouses": "Blouses, Shirts, and Shirt-Blouses (Women's and Girls'): Garments designed to cover the upper body from the neck to at or below the waist. Woven: May include overblouses that extend to the mid-thigh. Exclusions: Knit blouses and woven garments under heading 6206 generally exclude those with pockets below the waist or rib-knit waistbands",
            "tops": "Tops: A general category for upper body garments not more specifically classified elsewhere, often featuring limited neck or shoulder coverage (such as halter or tube tops) or not reaching the waist",
            "tank tops": "Tank tops: Sleeveless garments with oversized armholes and straps no wider than two inches. They lack neck openings (buttons/zippers), drawstrings, or waist tightening elements",
            "singlets":"Singlets: A British term for athletic-type shirts; these are sleeveless, close-fitting garments with narrow shoulder straps made of fine knit material",
            "bodyshirts": "Bodyshirts: Knit one-piece garments that cover the torso; they are generally styled like a shirt with a long tail that snaps between the legs",
            "undershirts":"Undershirts: Garments ordinarily worn under other clothing and not exposed to view when a person is conventionally dressed. This term is often used interchangeably with singlets",
            "trousers": "Outerwear garments with leg separations extending below the knee, held in place by waist or hip cinching mechanisms such as belts or elastic.",
            "shorts": "Trousers that do not cover the knee or extend below it.",
            "skirts": "Outer garments covering the body below the waistline, enclosing both legs in a single tube.",
            "divided skirts": "Garments that appear to be skirts from the front but are constructed so that each leg is individually surrounded by fabric.",
            "breeches": "A term used synonymously with trousers.",

            "ski/snowboard pants": "Ankle-length synthetic pants with sealed seams and hidden elastic leg sleeves, designed for cold-weather protection and may include insulation or scuff guards.",

            "dresses": "One-piece garments for women or girls that cover the upper body and extend to the mid-thigh or below, enclosing both legs in a single tube.",
            "jumpsuits": "One-piece garments combining a shirt and trousers, covering the body from the neck or shoulders to the knee or below.",
            "one-piece playsuits": "Abbreviated one-piece garments. For babies, they simulate a top and shorts. For others, they simulate a top and shorts ending above the knee and are intended to be worn without other outerwear.",
            "sunsuits": "Abbreviated one-piece garments designed for babies or women/girls, simulating a top and shorts. Interchangeable with washsuits for Customs purposes.",
            "wash suits": "Abbreviated one-piece garments designed for babies or women/girls, simulating a top and shorts. Interchangeable with sunsuits for Customs purposes.",

            "anoraks": "Protective outer garments designed for warmth and weather protection, typically featuring hoods, drawstrings, or specialized closures.",
            "windbreakers": "Protective outer garments designed for warmth and weather protection, typically featuring hoods, drawstrings, or specialized closures.",
            "jackets": "Garments designed to be worn over another garment for protection against the elements, generally covering the upper body from the neck to the waist and typically less than mid-thigh length.",
            "blazers": "Suit-type jackets tailored for business or social formality. Under HTSUS terminology, the term blazer is synonymous with suit-type jackets.",
            "suit-type jackets": "Tailored garments for business or social formality with a full frontal opening (without a zipper), sleeves, and three or more panels sewn together lengthwise.",

            "overcoats": "Outerwear garments that cover both the upper and lower body and are thigh-length or longer, featuring sleeves and a full-front opening for warmth and protection.",
            "carcoats": "Outerwear garments that cover both the upper and lower body and are thigh-length or longer, featuring sleeves and a full-front opening for warmth and protection.",
            "capes": "Sleeveless outerwear garments hanging loosely from the shoulders, extending to the waist or below and providing side coverage reaching at least to the elbow.",
            "cloaks": "Sleeveless outerwear garments similar to capes, grouped with overcoats and capes for protection against the weather.",
            "ski-jackets": "Jackets identifiable as intended for skiing, worn over other garments for protection against the elements.",

            "waistcoats (vests)": "Close-fitting garments with a full-front opening, traditionally part of a three-piece suit. Contemporary vests may be hip-length with oversized arm openings.",
            "ensembles": "Retail sets of garments in identical fabric, style, and color, consisting of one upper-body garment and one or two lower-body garments, excluding suits, track suits, and ski-suits.",
            "suits": "Tailored sets consisting of a coat or jacket and matching trousers, shorts, or a skirt, all of identical fabric, style, color, and composition.",
            "track suits": "Two-piece garments designed for sporting activities, consisting of a long-sleeved upper garment with tightening elements and trousers with an elasticized or drawstring waist.",
            "ski-suits": "Garments or sets identifiable as intended for alpine or cross-country skiing, consisting of either a one-piece ski overall or a multi-piece ski ensemble.",

            "sweaters": "Knit garments covering the body from the neck or shoulders to the waist or mid-thigh, defined for statistical purposes by a stitch count of 9 or fewer stitches per 2 centimeters.",
            "sweatshirts": "Pullover garments with long or short sleeves and snug-fitting cuffs and bottom. The fabric must be close-knit, unpatterned, and significantly napped on the inside.",
            "jumpers": "Women’s or girls’ knit or woven sleeveless one-piece garments similar to dresses, distinguished by insufficient coverage requiring wear over another garment.",
            "pullovers": "Upper-body knit garments without a full-length opening, designed to be pulled over the head and not more specifically provided for elsewhere.",
            "bodysuits": "Knit one-piece garments covering the torso and generally form-fitting, including leotards and unitards.",

            "pajamas": "Two-component sleepwear sets covering the upper and lower torso. Men’s/Boys’ consist of a shirt or pullover and shorts or pants; Women’s/Girls’ include various top and bottom combinations.",
            "nightshirts": "Long one-piece shirt-style or pullover-style garments worn specifically for sleeping.",
            "dressing gowns": "Loose garments worn in the home for comfort, reaching mid-thigh or below and featuring a full or partial front opening.",
            "bathrobes": "Loose garments worn in the home for comfort, reaching mid-thigh or below and featuring a full or partial front opening.",
            "negligees": "Loose garments worn in the home for comfort, similar to dressing gowns and bathrobes under HTS classification.",
            "night dresses": "One-piece garments for women or girls intended for wear in bed for sleeping.",

            "briefs": "Tight-fitting short underpants with an elasticized waist, worn by men and boys, and also including very short panties for women and girls.",
            "panties": "Short underpants for women and girls with no leg portion, fitting snugly at the waist or hips.",
            "underpants": "Long or short pants worn under other garments as underwear.",
            "slips": "Undergarments for women and girls beginning above the bust and secured with shoulder straps.",
            "petticoats": "Undergarments similar to slips but starting at the waist rather than the bust.",
            "brassieres": "Garments designed to mold or support the breasts, typically consisting of two cups, shoulder straps, and elasticized support elements.",
            "corsets": "Support garments reinforced with flexible stays and generally fastened with lacing or hooks.",
            "girdles": "Support garments designed to mold the lower torso and sometimes the legs, constructed from stretch fabric.",
            "garters": "Elasticized articles used to hold up hose, stockings, or shorten sleeves.",

            "hosiery": "A general trade term including garments such as tights, stockings, and similar leg coverings.",
            "panty hose": "Form-fitting hosiery treated similarly to tights under heading 6115.",
            "tights": "Form-fitting hosiery covering both the waist and legs, made of finely knit fabric with an elasticized waist.",
            "stockings": "Hosiery garments distinguished by length and fit, classified under heading 6115.",
            "socks": "Hosiery garments distinguished by length and fit, classified under heading 6115.",

            "swimwear": "Garments designed specifically for swimming, including swim trunks. Multi-use athletic shorts are not considered swimwear.",

            "bib and brace overalls": "Trouser-like garments with a permanently affixed full front bib extending above the waist and over-the-shoulder straps.",
            "overalls": "Garments used interchangeably with bib and brace overalls or coveralls under HTSUS terminology.",
            "coveralls": "One-piece garments combining a shirt and trousers, providing sufficient coverage to be worn alone.",

            "disposable briefs and panties": "Throw-away underpants designed for one-time use, typically made from non-woven man-made fibers.",
            "suspenders": "Detachable fabric straps worn over the shoulders to hold lower-body garments in place.",
            "braces": "British terminology for suspenders.",
            "gloves": "Hand coverings with separate sections for each finger and the thumb, used for protection or as apparel accessories.",
            "mittens": "Hand coverings with a separate section for the thumb only, designed primarily for warmth.",
            "mitts": "Fingerless gloves or padded sports mitts; excludes household mitts.",
            "handkerchiefs": "Small textile squares carried for personal hygiene or decorative purposes.",
            "headbands": "Textile accessories worn around the head to hold hair in place or for warmth.",
            "ponytail holders": "Textile accessories designed to secure hair into a ponytail.",
            "mantillas": "Lightweight textile veils worn over the head or shoulders."
            };

            const selectedFilters = {
                uiMainCategory: '',
                category: '',
                gender: 'All',
                material: 'All',
                fabric: 'All',
                country: '',
                exportingCountry: '',
                importingCountry: COUNTRY_ENGINE.getImportingCountry(),
                rateType: 'MFN',
                feature: 'All'
            };

            // ============ FILTER MENU FUNCTIONS ============

            const FILTER_DATA = {
                material: [
                    { value: 'All', label: 'All' },
                    { value: 'Knitted', label: 'Knitted or crocheted' },
                    { value: 'Woven', label: 'Woven or Non-Woven' }
                ],
                gender: [
                    { value: 'All', label: 'All' },
                    { value: 'Men', label: 'Men' },
                    { value: 'Women', label: 'Women' },
                    { value: 'Boys', label: 'Boys' },
                    { value: 'Girls', label: 'Girls' },
                    { value: 'Babies', label: 'Babies' }
                ],
                importingCountry: [
                    { value: COUNTRY_ENGINE.getImportingCountry(), label: COUNTRY_ENGINE.getImportingCountry() }
                ],
                fabric: [
                    { value: 'All', label: 'All' },
                    { value: 'Artificial fibers', label: 'Artificial fibers' },
                    { value: 'Cotton', label: 'Cotton' },
                    { value: 'Fine animal hair', label: 'Fine animal hair' },
                    { value: 'Flax fibers', label: 'Flax fibers' },
                    { value: 'Linen (835)', label: 'Linen (835)' },
                    { value: 'Man-made fibers', label: 'Man-made fibers' },
                    { value: 'Other textile materials', label: 'Other textile materials' },
                    { value: 'Silk or silk waste', label: 'Silk or silk waste' },
                    { value: 'Subject to cotton restraints (334)', label: 'Subject to cotton restraints (334)' },
                    { value: 'Subject to man-made fiber restraints (634)', label: 'Subject to man-made fiber restraints (634)' },
                    { value: 'Subject to wool restraints (434)', label: 'Subject to wool restraints (434)' },
                    { value: 'Synthetic fibers', label: 'Synthetic fibers' },
                    { value: 'Vegetable fibers', label: 'Vegetable fibers' },
                    { value: 'wool', label: 'Wool' }
                ],
                feature: [
                    { value: 'All', label: 'All' },
                    { value: 'Knit to Shape', label: 'Knit to Shape' },
                    { value: 'Recreational Performance Outerwear', label: 'Recreational Performance Outerwear' },
                    { value: 'Water resistant', label: 'Water resistant' }
                ]
            };

        selectedFilters.gender = 'All';
        selectedFilters.material = 'All';
        selectedFilters.feature = "All";

        function attemptAutoSearch() {
            searchHTSByFilters();
        }

        function getActiveCategoryAlert() {
            if (!selectedFilters.category) return null;

            const normalizedCategory = normalizeText(selectedFilters.category);

            for (const rule of Object.values(CATEGORY_ALERT_RULES)) {
                const hasExactMatch = rule.keywords.some(keyword =>
                    normalizeText(keyword) === normalizedCategory
                );

                if (hasExactMatch) {
                    return rule;
                }
            }
            return null;
        }

            function checkAdminMode() {
                // 🔑 Admin conditions (any one can enable admin)
                const isAdminByURL = new URLSearchParams(window.location.search).get("admin") === "true";
                const isAdminByStorage = localStorage.getItem("hts_admin") === "true";

                const isAdmin = isAdminByURL || isAdminByStorage;

                const adminSection = document.getElementById("adminSection");

                if (isAdmin && adminSection) {
                    adminSection.style.display = "block";
                    console.log("✅ Admin mode enabled");
                } else {
                    if (adminSection) adminSection.style.display = "none";
                    console.log("ℹ️ Admin mode disabled");
                }
            }

            function closeAllCategoryMenus() {
                const categoryMenu = document.getElementById("categoryMenu");
                if (categoryMenu) {
                    categoryMenu.style.display = "none";
                }

                document.querySelectorAll(".submenu").forEach(sm => {
                    sm.style.display = "none";
                });

                // Also close filter menus
                document.querySelectorAll(".filter-menu.show").forEach(menu => {
                    menu.classList.remove("show");
                });
                openFilterMenu = null;

                categoryMenuOpen = false; // 🔑 REQUIRED

                // Temporarily suppress hover handlers to avoid immediate submenu reopen
                suppressCategoryHover = true;
                setTimeout(() => { suppressCategoryHover = false; }, 250);
            }

            const categoryTrigger = document.querySelector(".category-trigger");
            const categoryMenu = document.getElementById("categoryMenu");
            
            categoryTrigger.addEventListener("click", e => {
                e.stopPropagation();
            
                // 🔑 CLOSE ALL FILTER MENUS FIRST
                document.querySelectorAll(".filter-menu.show").forEach(menu => {
                    menu.classList.remove("show");
                });
                openFilterMenu = null;
            
                // Toggle category
                if (categoryMenuOpen) {
                    closeAllCategoryMenus();
                    return;
                }
            
                categoryMenu.style.display = "block";
                categoryMenuOpen = true;
            });
            
            

                window.copyHTSCode = function (code, btn) {
                navigator.clipboard.writeText(code).then(() => {
                    btn.innerHTML = CHECK_SVG;
                    setTimeout(() => {
                        btn.innerHTML = COPY_SVG;
                    }, 1200);
                }).catch(err => {
                    console.error("Clipboard copy failed:", err);
                });
            };

            function enforceMaterialNeutralUI(category) {
                const materialSelect = document.getElementById("materialFilter");
                const materialTrigger = document.getElementById('materialTrigger');
                const materialMenu = document.getElementById('materialMenu');
                const materialNote = document.getElementById("materialNote");

                const isNeutral = MATERIAL_NEUTRAL_CATEGORIES.has(normalizeText(category));

                if (!category) {
                    // No category selected: restore UI to current selection
                    if (materialSelect) {
                        try { materialSelect.disabled = false; } catch(e){}
                    }
                    if (materialTrigger) {
                        materialTrigger.textContent = getFilterLabel('material', selectedFilters.material) + ' ▾';
                    }
                    if (materialMenu) {
                        materialMenu.querySelectorAll('.filter-menu-item.disabled').forEach(i => i.classList.remove('disabled'));
                    }
                    if (materialNote) materialNote.classList.remove('show');
                    return;
                }

                if (isNeutral) {
                    // Force material to All when category is material-neutral
                    selectedFilters.material = 'All';
                    if (materialSelect) {
                        try { materialSelect.value = 'All'; materialSelect.disabled = true; } catch(e){}
                    }
                    if (materialTrigger) materialTrigger.textContent = getFilterLabel('material', selectedFilters.material) + ' ▾';
                    if (materialMenu) {
                        materialMenu.querySelectorAll('.filter-menu-item').forEach(item => {
                            if (!/All/i.test(item.textContent)) item.classList.add('disabled');
                        });
                    }
                    if (materialNote) {
                        materialNote.innerHTML = 'Classified mainly by article type & fiber content, regardless of knit/woven construction';
                        materialNote.classList.add('show');
                    }
                } else {
                    // Not neutral: restore material selection (do not overwrite user's choice)
                    if (materialSelect) {
                        try { materialSelect.disabled = false; } catch(e){}
                    }
                    if (materialTrigger) materialTrigger.textContent = getFilterLabel('material', selectedFilters.material) + ' ▾';
                    if (materialMenu) {
                        materialMenu.querySelectorAll('.filter-menu-item.disabled').forEach(i => i.classList.remove('disabled'));
                    }
                    if (materialNote) materialNote.classList.remove('show');
                }
        }

            function toggleHighlight() {

                if (isResetting) return;
                if (!selectedFilters.category || !selectedFilters.exportingCountry) return;

                highlightEnabled = !highlightEnabled;

                const btn = document.getElementById("toggleHighlightBtn");

                btn.classList.toggle("active", highlightEnabled);
                btn.setAttribute("aria-pressed", highlightEnabled);
                btn.setAttribute(
                    "aria-label",
                    highlightEnabled ? "Disable highlight" : "Enable highlight"
                );

                btn.dataset.tooltip = highlightEnabled
                    ? "Highlight ON"
                    : "Highlight OFF";

                searchHTSByFilters();
                }

                function handleCategorySelection(mainCategory, productCategory) {
                    // Ensure the menu always closes even if an error occurs during handling
                    try {
                        selectedFilters.uiMainCategory = mainCategory;
                        selectedFilters.category = productCategory;

                        // Update trigger text
                        const trigger = document.querySelector(".category-trigger");
                        if (trigger) trigger.textContent = `${mainCategory} ▸ ${productCategory}`;

                        console.log('handleCategorySelection called:', { mainCategory, productCategory, selectedFilters });

                        // CATEGORY DESCRIPTION / INFO ICON
                        try {
                            const infoIcon = document.getElementById("categoryInfoIcon");
                            const tooltip = document.getElementById("categoryInfoTooltip");
                            const key = normalizeText(productCategory);

                            if (infoIcon && tooltip) {
                                if (categoryDescriptions[key]) {
                                    infoIcon.classList.remove("disabled");
                                    infoIcon.classList.add("active");
                                    infoIcon.classList.remove("open");
                                    tooltip.innerHTML = `\n                                        <b>${productCategory}</b><br>\n                                       ${categoryDescriptions[key]}\n                                       <hr style=\"margin:8px 0\">\n                                        <a href=\"${CBP_APPAREL_PDF}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"font-size:12px; color:#4a90e2;\" class=\"cbp-pdf-link\"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="cbp-pdf-icon" viewBox="0 0 16 16">
                                    <!-- svg paths unchanged -->
                                    <path d="M5.523 12.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 6.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z"></path>
                                    <path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.7 11.7 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"></path>
                                    
                                    </svg> View official CBP Apparel Terminology Guide (PDF)</a>`;
                                } else {
                                    infoIcon.classList.remove("active");
                                    infoIcon.classList.add("disabled");
                                    tooltip.innerHTML = "No description available for this category.";
                                }
                            }
                        } catch (innerErr) {
                            console.error('Category info render error', innerErr);
                        }

                        // Existing logic
                        handleAccessoriesGenderRule(mainCategory);
                        enforceGenderNeutralUI(productCategory);
                        enforceMaterialNeutralUI(productCategory);

                        // Rebuild affected filter menus so UI reflects forced 'All' or restored state
                        try { buildFilterMenu('gender'); } catch (e) {}
                        try { buildFilterMenu('material'); } catch (e) {}

                        // Trigger search
                        console.log('Calling searchHTSByFilters from handleCategorySelection');
                        searchHTSByFilters();
                    } catch (err) {
                        console.error('Error handling category selection:', err);
                    } finally {
                        // Always close menus and reset state
                        try { closeAllCategoryMenus(); } catch (closeErr) { console.error('Error closing category menus:', closeErr); }
                    }
                }

                function showCopied(btn) {
                btn.innerHTML = CHECK_SVG;
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = COPY_SVG;
                    btn.disabled = false;
                }, 1200);
            }

                function fallbackCopy(text, btn) {
                    const ta = document.createElement("textarea");
                    ta.value = text;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand("copy");
                    document.body.removeChild(ta);
                    showCopied(btn);
                }

                function resetMaterialFilterUI() {
                    const materialSelect = document.getElementById("materialFilter");
                    const materialNote = document.getElementById("materialNote");

                    if (!materialSelect) return;

                    materialSelect.value = "All";
                    selectedFilters.material = "All";

                    Array.from(materialSelect.options).forEach(opt => {
                        opt.disabled = false;
                    });

                    if (materialNote) {
                        materialNote.classList.remove("show");
                    }
                }

                // 🔒 Category lock based on gender
                function getVisibleMainCategories() {

                    // If Babies selected → only show Babies category
                    if (selectedFilters.gender === "Babies") {
                        return {
                            "Babies & Infant Wear": MAIN_CATEGORY_MAP["Babies & Infant Wear"]
                        };
                    }

                    // Otherwise show everything
                    return MAIN_CATEGORY_MAP;
                }



                function resetDropdownSelection(menuSelector, defaultValue = "All") {
                    const menu = document.querySelector(menuSelector);
                    if (!menu) return;
                
                    const items = menu.children; // 🔑 key fix
                
                    Array.from(items).forEach(item => {
                        item.classList.remove("selected", "active", "checked");
                
                        const value =
                            item.dataset?.value ||
                            item.textContent.trim();
                
                        if (value === defaultValue) {
                            item.classList.add("selected");
                        }
                    });
                }
                function closeAllMenus() {
                    // Close normal filters
                    document.querySelectorAll(".filter-menu").forEach(menu => {
                        menu.style.display = "none";
                    });
                
                    // Close category menu
                    const categoryMenu = document.getElementById("categoryMenu");
                    if (categoryMenu) {
                        categoryMenu.style.display = "none";
                    }
                
                    // Close category submenus
                    document.querySelectorAll(".submenu").forEach(sub => {
                        sub.style.display = "none";
                    });
                }
                
                
                function resetAllFilters() {
                    isResetting = true; // 🔒 lock everything

                    // 🔄 Reset state
                    selectedFilters.uiMainCategory = '';
                    selectedFilters.category = '';
                    selectedFilters.gender = 'All';
                    selectedFilters.fabric = 'All';
                    selectedFilters.material = 'All';
                    selectedFilters.country = '';
                    selectedFilters.exportingCountry = '';
                    selectedFilters.rateType = 'MFN';
                    selectedFilters.feature = 'All';

                    // 🔽 Reset filter menu triggers
                    document.getElementById('genderTrigger').textContent = 'All ▾';
                    document.getElementById('fabricTrigger').textContent = 'All ▾';
                    document.getElementById('materialTrigger').textContent = 'All ▾';
                    document.getElementById('featureTrigger').textContent = 'All ▾';
                    document.getElementById('countryTrigger').textContent = 'Select Country ▾';

                    closeAllCategoryMenus();

                    // 🧹 RESET CATEGORY + SUBCATEGORY UI STATES
                    document.querySelectorAll('.category-item')
                        .forEach(item => {
                            item.classList.remove('selected', 'active');
                        });

                    document.querySelectorAll('.submenu-item')
                        .forEach(item => {
                            item.classList.remove('selected');
                        });


                    // ❌ Hide notes
                    document.getElementById("genderNote").style.display = "none";
                    document.getElementById("materialNote").classList.remove("show");

                    // 🔽 Reset category UI
                    document.querySelector('.category-trigger').textContent = 'Select Category ▾';


                    // 🔆 RESET HIGHLIGHT (✅ correct way)
                    highlightEnabled = false;

                    const highlightBtn = document.getElementById("toggleHighlightBtn");
                    highlightBtn.classList.remove("active");
                    highlightBtn.setAttribute("aria-pressed", "false");
                    highlightBtn.setAttribute("aria-label", "Enable highlight");
                    highlightBtn.dataset.tooltip = "Highlight OFF";


                    // ✅ RESET DROPDOWN MENU CHECKS
                    // ✅ RESET DROPDOWN MENU CHECKS
                    resetDropdownSelection("#genderMenu", "All");
                    resetDropdownSelection("#materialMenu", "All");
                    resetDropdownSelection("#fabricMenu", "All");
                    resetDropdownSelection("#featureMenu", "All");
                    resetDropdownSelection("#countryMenu", ""); // 🔥 fixed ID



                    // ❌ Hide category description
                    const infoIcon = document.getElementById("categoryInfoIcon");
                    const tooltip = document.getElementById("categoryInfoTooltip");

                    infoIcon.classList.remove("active");
                    infoIcon.classList.add("disabled");

                    tooltip.innerHTML = "Select a category to see its definition.";

                    document.querySelectorAll(".fabric-search").forEach(input => {
                        input.value = "";
                    });

                    // 🔄 RESET FILTERED FABRIC LIST
                    document.querySelectorAll("#fabricInfoTooltip li").forEach(li => {
                        li.style.display = "";
                    });

                    // 🔓 unlock category menu after reset
                    buildCategoryMenu();

                    // 🧹 Clear results
                    clearResults();

                    // 🔓 unlock
                    setTimeout(() => {
                        isResetting = false;
                    }, 0);

                    console.log('✅ HARD RESET COMPLETE');
                    }


                async function loadFlatFile() {
                    try {
                        const res = await fetch("data/master.json");
                        const data = await res.json();
                        masterData = data;
                        document.getElementById("totalResults").innerText = masterData.length;
                        showStatus(`Master file loaded: ${masterData.length} records`);
                        console.log("HTS Master file loaded:", data.length);
                    } catch (e) {
                        console.warn("No master.json file found");
                        showStatus("No master.json found. Please import JSON files manually.", true);
                    }


                }

                function initializeCountries() {

                    const trade = COUNTRY_ENGINE.getTradeConfig();

                    const countries = [
                        ...trade.column2Countries.map(name => ({ name, type: 'Column 2' })),
                        ...trade.specialCountries.map(c => ({ name: c.name, type: 'Special' })),

                        // ⭐ Default general countries (shared across all engines)
                        { name: 'India', type: 'General' },
                        { name: 'China', type: 'General' },
                        { name: 'Vietnam', type: 'General' },
                        { name: 'Bangladesh', type: 'General' },
                        { name: 'Pakistan', type: 'General' },
                        { name: 'Indonesia', type: 'General' },
                        { name: 'Turkey', type: 'General' },
                        { name: 'Mexico', type: 'General' },
                        { name: 'Brazil', type: 'General' }
                    ];

                    allCountries = countries.sort((a, b) => a.name.localeCompare(b.name));

                    buildCountriesFilter();
                }


                function getCategoryAlerts(description) {
                    const matches = [];
                    const text = normalizeText(description);

                    for (const [category, rule] of Object.entries(CATEGORY_ALERT_RULES)) {
                        const matchedKeyword = rule.keywords.find(keyword =>
                            text === normalizeText(keyword)
                        );

                        if (matchedKeyword) {
                            matches.push({
                                category,
                                keyword: matchedKeyword,
                                message: rule.message.trim()
                            });
                        }
                    }

                    return matches;
                }


                function getRateType(countryName) {

                    const trade = COUNTRY_ENGINE.getTradeConfig();

                    if (trade.column2Countries.includes(countryName)) {
                        return 'Column 2';
                    }

                    if (trade.specialCountries.some(c => c.name === countryName)) {
                        return 'Special';
                    }

                    return 'General';
                }


                function getRate(item, rateType) {
                    let rateField = '';
                    if (rateType === 'Column 2') {
                        rateField = 'other';
                    } else if (rateType === 'Special') {
                        rateField = 'special';
                    } else {
                        rateField = 'general';
                    }
                    let rate = item[rateField];
                    if (!rate || rate === '' || rate === 'N/A') {
                        const parentItem = findParentWithRate(item, rateField);
                        if (parentItem) {
                            return { value: parentItem[rateField], inherited: true };
                        }
                        return { value: 'N/A', inherited: false };
                    }
                    return { value: rate, inherited: false };
                }
  
                function selectCategory(item) {
                    // Remove old selection
                    document.querySelectorAll(".category-item.selected")
                        .forEach(el => el.classList.remove("selected"));
                
                    // Select current
                    item.classList.add("selected");
                
                    // Update trigger text
                    document.querySelector(".category-trigger").textContent =
                        item.querySelector(".label").textContent;
                
                    // Save selection
                    selectedFilters.category = item.dataset.value;
                
                    // Enable info icon
                    document.getElementById("categoryInfoIcon")
                        .classList.remove("disabled");
                }
                function restoreSelectedCategory() {
                    if (!selectedFilters.category) return;

                    const selectedItem = document.querySelector(
                        `.category-item[data-value="${selectedFilters.category}"]`
                    );

                    if (selectedItem) {
                        selectedItem.classList.add("selected");
                    }
                }
                
                function buildCategoryMenu() {
                    const container = document.getElementById("categoryMenu");
                    container.innerHTML = "";

                    // 🧹 VERY IMPORTANT — remove old floating submenus
                    document.querySelectorAll(".submenu").forEach(el => el.remove());

                    container.addEventListener("click", e => e.stopPropagation());


                const visibleCategories = getVisibleMainCategories();

                Object.entries(visibleCategories)
                .sort((a, b) => a[0].localeCompare(b[0])) // ⭐ sort main categories alphabetically
                .forEach(([mainCat, subCats]) => {



                        const mainDiv = document.createElement("div");
                        mainDiv.className = "category-item";
                        mainDiv.dataset.main = mainCat;
                        mainDiv.textContent = mainCat;


                        // 🔑 ADD THIS LINE
                        mainDiv.addEventListener("click", e => {
                            e.stopPropagation();
                        });

                        const submenu = document.createElement("div");
                        submenu.className = "submenu";
                        submenu.style.display = "none";

                        [...subCats].sort((a, b) => a.localeCompare(b)).forEach(sub => {
                            const subDiv = document.createElement("div");
                            subDiv.className = "submenu-item";
                            subDiv.dataset.main = mainCat;
                            subDiv.dataset.sub = sub;

                            subDiv.innerHTML = `
                                <span class="tick">✔</span>
                                <span class="label">${sub}</span>
                            `;


                            subDiv.addEventListener("click", e => {
                                e.stopPropagation();
                            
                                // 🔥 Clear old selections
                                document.querySelectorAll(".submenu-item.selected")
                                    .forEach(el => el.classList.remove("selected"));
                            
                                document.querySelectorAll(".category-item.active")
                                    .forEach(el => el.classList.remove("active"));
                            
                                // ✅ Select current subcategory
                                subDiv.classList.add("selected");
                            
                                // ✅ Select parent main category
                                const parentMain = document.querySelector(
                                    `.category-item[data-main="${mainCat}"]`
                                );
                                if (parentMain) {
                                    parentMain.classList.add("active");
                                }
                            
                                // ✅ Save selected category
                                selectedFilters.category = `${mainCat} → ${sub}`;
                            
                                // ✅ Update trigger
                                document.querySelector(".category-trigger").textContent =
                                    `${mainCat} → ${sub}`;
                            
                                // ✅ Enable info icon
                                document.getElementById("categoryInfoIcon")
                                    .classList.remove("disabled");
                            
                                handleCategorySelection(mainCat, sub);
                                closeAllCategoryMenus();
                            });
                            
                            

                            submenu.appendChild(subDiv);
                        });

                        mainDiv.addEventListener("mouseenter", () => {
                            if (suppressCategoryHover) return;
                            hideAllSubmenus();

                            const rect = mainDiv.getBoundingClientRect();
                            submenu.style.display = "block";
                            submenu.style.top = `${rect.top}px`;
                            submenu.style.left = `${rect.right + 8}px`;

                            const subRect = submenu.getBoundingClientRect();
                            if (subRect.right > window.innerWidth) {
                                submenu.style.left = `${rect.left - subRect.width - 8}px`;
                            }
                            if (subRect.bottom > window.innerHeight) {
                                submenu.style.top =
                                    `${window.innerHeight - subRect.height - 12}px`;
                            }
                        });

                        document.body.appendChild(submenu);
                        container.appendChild(mainDiv);
                    });
                    }

                    function filterFabricRules(input) {
                        const query = input.value.toLowerCase();
                        const list = input.closest('.fabric-classification')
                                         .querySelectorAll('.fabric-rule-list li');
                    
                        list.forEach(li => {
                            const text = li.textContent.toLowerCase();
                            li.style.display = text.includes(query) ? '' : 'none';
                        });
                    }
                    

                function hideAllSubmenus() {
                    document.querySelectorAll(".submenu").forEach(sm => {
                        sm.style.display = "none";
                    });
                }

                function findParentWithRate(item, rateField) {
                    const currentIndex = masterData.indexOf(item) == -1 ? masterData.findIndex(InnerItem => InnerItem.htsno === item.htsno && InnerItem.description === item.description) : masterData.indexOf(item);
                    const currentIndent = parseInt(item.indent);

                    for (let i = currentIndex - 1; i >= 0; i--) {
                        const checkItem = masterData[i];
                        const checkIndent = parseInt(checkItem.indent);
                        if (checkIndent < currentIndent) {
                            if (checkItem[rateField] && checkItem[rateField] !== '' && checkItem[rateField] !== 'N/A') {
                                return checkItem;
                            }
                        }
                        if (checkIndent === 0 && i !== currentIndex - 1) break;
                    }
                    return null;
                }

                function getChapterFromHTS(htsno) {
                    if (!htsno) return null;
                    const chapter = htsno.substring(0, 2);
                    return parseInt(chapter);
                }

                function matchesWordBoundary(text, searchWord) {
                    const regex = new RegExp(`\\b${searchWord}\\b`, 'i');
                    return regex.test(text);
                }

                function showStatus(message, isError = false) {
                    const statusDiv = document.getElementById('statusMessage');
                    statusDiv.textContent = message;
                    statusDiv.className = 'status-message ' + (isError ? 'status-error' : 'status-success');
                    statusDiv.style.display = 'block';
                    setTimeout(() => {
                        statusDiv.style.display = 'none';
                    }, 3000);
                }

                function importJSON() {
                    const fileInput = document.getElementById('jsonFileInput');
                    const files = fileInput.files;
                    if (files.length === 0) {
                        showStatus('Please select at least one JSON file', true);
                        return;
                    }
                    let filesProcessed = 0;
                    const newData = [];
                    Array.from(files).forEach(file => {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            try {
                                const jsonData = JSON.parse(e.target.result);
                                newData.push(...jsonData);
                                filesProcessed++;
                                if (filesProcessed === files.length) {
                                    masterData = [...masterData, ...newData];
                                    document.getElementById("totalResults").innerText = masterData.length;
                                    showStatus(`Successfully imported ${files.length} file(s). Total records: ${masterData.length}`);
                                    fileInput.value = '';
                                }
                            } catch (error) {
                                showStatus('Error parsing JSON file: ' + file.name, true);
                            }
                        };
                        reader.readAsText(file);
                    });
                }

                function isExactProductAtLeaf(item, productCategory) {
                    const path = getHierarchyPath(item);

                    if (!path.length) return false;

                    const last = normalizeText(path[path.length - 1].description);
                    const parent =
                        path.length > 1
                            ? normalizeText(path[path.length - 2].description)
                            : '';

                    const normalizedCategory = normalizeText(productCategory);

                    return (
                        last.includes(normalizedCategory) ||
                        parent.includes(normalizedCategory)
                    );
                }

                function enforceGenderNeutralUI(category) {
                    const genderSelect = document.getElementById("genderFilter");
                    const genderTrigger = document.getElementById('genderTrigger');
                    const genderMenu = document.getElementById('genderMenu');
                    const genderNote = document.getElementById("genderNote");

                    const safeEnableAllLegacy = () => {
                        if (genderSelect && genderSelect.options) {
                            try { Array.from(genderSelect.options).forEach(o => o.disabled = false); } catch (e) {}
                        }
                    };

                    if (!category) {
                        // 🔄 RESET STATE
                        safeEnableAllLegacy();
                        if (genderTrigger) genderTrigger.textContent = getFilterLabel('gender', selectedFilters.gender) + ' ▾';
                        if (genderMenu) genderMenu.querySelectorAll('.filter-menu-item.disabled').forEach(i => i.classList.remove('disabled'));
                        if (genderNote) genderNote.style.display = "none";
                        return;
                    }

                    const isNeutral = GENDER_NEUTRAL_CATEGORIES.has(normalizeText(category));

                    if (!isNeutral) {
                        if (selectedFilters.uiMainCategory !== "Accessories") {
                            safeEnableAllLegacy();
                            if (genderMenu) genderMenu.querySelectorAll('.filter-menu-item.disabled').forEach(i => i.classList.remove('disabled'));
                            if (genderNote) genderNote.style.display = "none";
                        }
                        return;
                    }

                    // For neutral categories, force All
                    selectedFilters.gender = "All";
                    if (genderSelect) {
                        try { genderSelect.value = 'All'; } catch(e) {}
                    }
                    if (genderTrigger) genderTrigger.textContent = getFilterLabel('gender', selectedFilters.gender) + ' ▾';

                    if (genderSelect && genderSelect.options) {
                        try { Array.from(genderSelect.options).forEach(o => { o.disabled = o.value !== 'All'; }); } catch(e) {}
                    }

                    if (genderMenu) {
                        genderMenu.querySelectorAll('.filter-menu-item').forEach(item => {
                            if (!/All/i.test(item.textContent)) item.classList.add('disabled');
                        });
                    }

                    if (genderNote) {
                        genderNote.innerHTML = "Women foundation garments / gender-neutral support accessories";
                        genderNote.style.display = "block";
                    }
                }

                function handleAccessoriesGenderRule(mainCategory) {
                    const genderSelect = document.getElementById('genderFilter');
                    const genderTrigger = document.getElementById('genderTrigger');
                    const genderMenu = document.getElementById('genderMenu');
                    const genderNote = document.getElementById('genderNote');

                    if (mainCategory === "Accessories") {
                        // 🔒 Force gender = All
                        selectedFilters.gender = 'All';

                        // If legacy <select> exists, update it
                        if (genderSelect) {
                            try {
                                genderSelect.value = 'All';
                                Array.from(genderSelect.options).forEach(opt => {
                                    opt.disabled = opt.value !== 'All';
                                });
                            } catch (e) {
                                console.warn('Could not update legacy gender select', e);
                            }
                        }

                        // If new custom trigger exists, update its text
                        if (genderTrigger) {
                            genderTrigger.textContent = getFilterLabel('gender', selectedFilters.gender) + ' ▾';
                        }

                        // Optionally mark non-All items in custom menu as disabled (visual only)
                        if (genderMenu) {
                            genderMenu.querySelectorAll('.filter-menu-item').forEach(item => {
                                if (!/All/i.test(item.textContent)) item.classList.add('disabled');
                            });
                        }

                        if (genderNote) {
                            genderNote.innerHTML = 'Gender filter is disabled for <b>Accessories (HTS-unisex category)</b>';
                            genderNote.style.display = 'block';
                        }

                    } else {
                        // 🔓 Restore normal behavior
                        if (genderSelect) {
                            try {
                                Array.from(genderSelect.options).forEach(opt => {
                                    opt.disabled = false;
                                });
                            } catch (e) {
                                console.warn('Could not restore legacy gender select', e);
                            }
                        }

                        if (genderMenu) {
                            genderMenu.querySelectorAll('.filter-menu-item.disabled').forEach(item => {
                                item.classList.remove('disabled');
                            });
                        }

                        // ❌ Hide note for other categories
                        if (genderNote) {
                            genderNote.style.display = 'none';
                            genderNote.innerHTML = '';
                        }
                    }
                }

                function getHierarchyPath(item) {
                    const hierarchyItems = [];
                    let currentIndent = parseInt(item.indent);
                    let currentIndex = masterData.indexOf(item);

                    for (let i = currentIndex; i >= 0; i--) {
                        const checkItem = masterData[i];
                        const checkIndent = parseInt(checkItem.indent);
                        if (checkIndent < currentIndent || i === currentIndex) {
                            hierarchyItems.unshift(checkItem);
                            currentIndent = checkIndent;
                        }
                        if (currentIndent === 0) break;
                    }
                    return hierarchyItems;
                }
      
                function getFullDescription(item) {
                    let descriptions = [item.description];
                    let currentIndent = parseInt(item.indent);
                    let currentIndex = masterData.indexOf(item);

                    for (let i = currentIndex - 1; i >= 0; i--) {
                        const prevItem = masterData[i];
                        const prevIndent = parseInt(prevItem.indent);

                        if (prevIndent < currentIndent) {
                            descriptions.unshift(prevItem.description);
                            currentIndent = prevIndent;
                        }

                        if (currentIndent === 0) break;
                    }

                    return descriptions.join(' > ');
                }

                function isTenDigitHTS(htsno) {
                        if (!htsno) return false;
                        const digitsOnly = htsno.replace(/\D/g, '');
                        return digitsOnly.length === 10;
                    }

                function getFullHierarchyText(item) {
                        const path = getHierarchyPath(item);
                        return path.map(n => n.description.toLowerCase()).join(' ');
                    }

                function matchesCategoryInLastNodes(item, keywords) {
                            const path = getHierarchyPath(item);

                            if (!path.length) return false;

                            const lastNode = path[path.length - 1].description.toLowerCase();
                            const secondLastNode =
                                path.length > 1 ? path[path.length - 2].description.toLowerCase() : '';

                            return keywords.some(k =>
                                matchesWordBoundary(lastNode, k) ||
                                matchesWordBoundary(secondLastNode, k)
                            );
                }

                function getGenderScope(item) {
                        const path = getHierarchyPath(item);
                        const found = new Set();

                        path.forEach(node => {
                            const text = normalizeText(node.description);

                            for (const [gender, terms] of Object.entries(GENDER_TERMS)) {
                                if (terms.some(t => new RegExp(`\\b${t}\\b`, 'i').test(text))) {
                                    found.add(gender);
                                }
                            }
                        });

                        return found.size ? Array.from(found) : null;
                    }

                function getProductSubtype(item) {
                    const path = getHierarchyPath(item);
                    return normalizeText(path[path.length - 1].description);
                }

                function extractGendersFromText(text) {
                    const found = new Set();
                    const normalized = normalizeText(text);

                    for (const [gender, terms] of Object.entries(GENDER_TERMS)) {
                        terms.forEach(term => {
                            const regex = new RegExp(
                                `\\b${term}(?:'s|’s|s)?(?:\\s+or\\s+\\w+)?\\b`,
                                'i'
                            );
                            if (regex.test(normalized)) {
                                found.add(gender);
                            }
                        });
                    }

                    return found.size ? Array.from(found) : null;
                }

                function getGenderFromLeafAndParent(item) {
                    const path = getHierarchyPath(item);
                    if (!path.length) return null;

                    const gendersInLeaf = extractGendersFromText(path[path.length - 1].description) || [];
                    const genders = new Set(gendersInLeaf);

                    // parent node
                    if (path.length > 1) {
                        const parentGenders = extractGendersFromText(path[path.length - 2].description) || [];
                        parentGenders.forEach(g => {
                            if (!gendersInLeaf.includes(g)) genders.add(g); // avoid duplicate
                        });
                    }

                    return genders.size ? Array.from(genders) : null;
                }

                function matchesCategoryHierarchy(item, keywords) {
                    const path = getHierarchyPath(item);

                    if (!path.length) return false;

                    // ✅ Check parent nodes first
                    for (let i = 0; i < path.length - 1; i++) {
                        const node = normalizeText(path[i].description);
                        if (keywords.some(k => matchesWordBoundary(node, k))) return true;
                    }

                    // ✅ Then check leaf node
                    const leaf = normalizeText(path[path.length - 1].description);
                    if (keywords.some(k => matchesWordBoundary(leaf, k))) return true;

                    return false;
                }

                function getCategoryScope(category) {
                    const text = normalizeText(category);

                    if (text.includes("babies") || text.includes("infant")) return "babies";
                    if (text.includes("girls")) return "girls";
                    if (text.includes("boys")) return "boys";
                    if (text.includes("women")) return "women";
                    if (text.includes("men")) return "men";

                    return null;
                }

                function isMatchInParent(item, productCategoryNormalized) {
                    const path = getHierarchyPath(item);
                    for (let i = 0; i < path.length - 1; i++) {
                        if (matchesWordBoundary(normalizeText(path[i].description), productCategoryNormalized)) {
                            return true;
                        }
                    }
                    return false;
                }

                function getCategoryLeaf(category) {
                    if (!category) return "";
                    return normalizeText(category.split(">").pop().trim());
                }
                

                const SINGLE_NODE_STRONG_CATEGORIES = new Set([
                    "handkerchiefs",
                    "braces",
                    "suspenders",
                    "negligees",
                    "night dresses",
                    "shawls",
                    "shirts",
                    "garters",
                    "scarves",
                    "socks",
                    "bow ties",
                    "cravats",
                    "mantillas",
                    "mittens",
                    "mitts",
                    "mufflers",
                    "veils",
                    "bodysuits",
                    "sweaters",
                    "sweatshirts",
                    "bodyshirts",
                    "shirt-blouses",
                    "undershirts",
                ]);

                const SCOPE_CATEGORIES = new Set([
                        "babies",
                        "infants",
                        "toddlers",
                        "girls",
                        "boys",
                        "women",
                        "men",
                        "blouses",
                        "sets",
                    ]);

                function hasScopeInHierarchy(item, scope) {
                    const path = getHierarchyPath(item);
                    const scopeRegex = new RegExp(`\\b${scope}\\b`, "i");

                    return path.some(p =>
                        scopeRegex.test(normalizeText(p.description))
                    );
                }

                function isSingleNodeStrongCategory(category) {
                    return SINGLE_NODE_STRONG_CATEGORIES.has(
                        normalizeText(category)
                    );
                }

                const CATEGORY_SYNONYMS = {
                    "Pullovers": ["pullovers", "pullover"],
                    "Sweaters": ["sweaters", "sweater"],
                };

                const CATEGORY_EXCLUSIONS = {
                    "Suits": {
                        excludeKeywords: ["track suits", "ski suits", "ski-suits"],
                        allowedChapters: ["61", "62"] // tailored garments only
                    },
                    "Socks": {
                        excludeParentKeywords: ["babies", "infants"],
                        allowedChapters: ["61"]
                    },
                    "Pullovers":{
                        excludeParentKeywords: ["babies", "infants"],
                        allowedChapters: ["61"]
                    },
                    "Coats": {
                        excludeParentKeywords: ["raincoats", "poncho","over","carcoats"], // example: skip these if needed
                        allowedChapters: ["61", "62"]             // limit to knitted/woven chapters
                    },
                    "Jackets": {
                        excludeParentKeywords: ["ski-jackets"], // example: skip these if needed
                        allowedChapters: ["61", "62"]             // limit to knitted/woven chapters
                    },
                    "Shirt-Blouses": {
                        excludeParentKeywords:["Track suits", "Ski suits"],
                        allowedChapters: ["61", "62"]
                    },
                    "Tops": {
                        excludeParentKeywords: ["tank tops"],
                        allowedChapters: ["61", "62"]
                    },
                    "Undershirts": {
                        excludeParentKeywords: ["Thermal undershirts"],
                        allowedChapters: ["61", "62"]
                    },
                    "Shirts":{
                        excludeParentKeywords:["T-shirts"],
                        allowedChapters: ["61","62"]
                    },
                    "Plastic or Rubber Coated Garments":{
                        excludeParentKeywords: ["overcoats","ensembles","sweaters","loomed","wool","dress","warp","silk","tracksuits","pajamas","swimwear","jumpsuits","T-shirts","knitted","textile","playsuits",],
                        excludeKeywords:["cotton"],
                        allowedChapters: ["61", "62"]
                    },
                    "Ties": {
                        excludeParentKeywords: ["panties","booties"],
                        allowedChapters: ["61", "62"]
                    },
                    "Dresses": {
                        excludeParentKeywords: ["nightdresses"],
                        allowedChapters: ["61", "62"]
                    }
                    
                };

                function searchHTSByFilters() {
                    console.log('searchHTSByFilters invoked', selectedFilters);
                    

                
                    if (isResetting) return;
                    if (!selectedFilters.category || !selectedFilters.exportingCountry) {
                        clearResults();
                        return;
                    }
                
                    const productCategory = selectedFilters.category;
                    const gender = selectedFilters.gender || 'All';
                    const material = selectedFilters.material || 'All';
                    const fabric = selectedFilters.fabric || 'All';
                    const exportingCountry = selectedFilters.exportingCountry;

                    const isBabiesSearch = gender === "Babies";
                
                    if (!productCategory || !exportingCountry) {
                        document.getElementById("resultsContainer").innerHTML =
                            "<div class='no-results'>Please select Product Category and Country</div>";
                        return;
                    }
                
                    /* 🔑 STEP 1: derive HTS keywords ONLY from PRODUCT CATEGORY */
                    let keywordList = CATEGORY_KEYWORDS[productCategory] || [];
                
                    // Fallback: match sub-item inside grouped keywords
                    if (!keywordList.length) {
                        const normalizedProduct = normalizeText(productCategory);
                        for (const kws of Object.values(CATEGORY_KEYWORDS)) {
                            if (kws.some(kw => normalizeText(kw) === normalizedProduct)) {
                                keywordList = kws;
                                break;
                            }
                        }
                    }
                
                    if (!keywordList.length) return;
                
                    const productCategoryNormalized = normalizeText(productCategory);
                
                    /* 🔑 STEP 2: FILTER masterData */
                    let filtered = masterData
                        .filter(item => {
                
                            if (!item.htsno || !isTenDigitHTS(item.htsno)) return false;
                
                            const chapter = item.htsno.substring(0, 2);
                            const normalizedDesc = normalizeText(getFullHierarchyText(item));
                
                            /* 🚫 CATEGORY-SPECIFIC HARD EXCLUSIONS */
                            const rule = CATEGORY_EXCLUSIONS[productCategory];
                            if (rule) {
                
                                if (
                                    rule.excludeParentKeywords &&
                                    selectedFilters.gender !== 'Babies' &&
                                    rule.excludeParentKeywords.some(k =>
                                        new RegExp(`\\b${k}\\b`, 'i').test(normalizedDesc)
                                    )
                                ) return false;
                
                                if (
                                    rule.excludeKeywords &&
                                    rule.excludeKeywords.some(kw =>
                                        new RegExp(`\\b${kw}\\b`, 'i').test(normalizedDesc)
                                    )
                                ) return false;
                
                                if (
                                    rule.allowedChapters &&
                                    !rule.allowedChapters.includes(chapter)
                                ) return false;
                            }
                
                            /* 👶 BABIES SCOPE — STRICT */
                            const derivedScope = getCategoryScope(productCategory);
                            if (derivedScope) {
                                const hasHierarchyScope = hasScopeInHierarchy(item, derivedScope);
                                const hasExactCategoryPhrase =
                                    normalizedDesc.includes(productCategoryNormalized);
                
                                // Babies text alone is NOT enough
                                if (!hasHierarchyScope && !hasExactCategoryPhrase) {
                                    return false;
                                }
                            }
                
                            /* ✅ GENDER */
                            if (gender !== "All") {
                                const leafGenders = getGenderFromLeafAndParent(item);
                
                                if (gender === "Babies") {
                                    if (!leafGenders?.includes("Babies")) {
                                        const scope = getGenderScope(item);
                                        if (!scope?.includes("Babies")) return false;
                                    }
                                } else {
                                    if (leafGenders) {
                                        if (!leafGenders.includes(gender)) return false;
                                    } else {
                                        const scope = getGenderScope(item);
                                        if (!scope?.includes(gender)) return false;
                                    }
                                }
                            }
                
                            /* ✅ FABRIC */
                            if (fabric !== "All" &&
                                !normalizedDesc.includes(normalizeText(fabric))) {
                                return false;
                            }
                
                            /* ✅ FEATURE */
                            if (selectedFilters.feature !== "All") {
                                if (!normalizedDesc.includes(
                                    normalizeText(selectedFilters.feature)
                                )) {
                                    return false;
                                }
                            }
                
                            /* ✅ MATERIAL */
                            const isMaterialNeutral =
                                MATERIAL_NEUTRAL_CATEGORIES.has(productCategoryNormalized);
                
                            if (!isMaterialNeutral) {
                                if (material === "Knitted" && chapter !== "61") return false;
                                if (material === "Woven" && chapter !== "62") return false;
                            }
                
                            return true;
                        })
                
                        /* 🔑 STEP 3: SCORE & TAG */
                        .map(item => {
                
                            const fullDesc = normalizeText(getFullHierarchyText(item));
                
                            let keywordHits = 0;
                            let uniqueHits = 0;
                
                            keywordList.forEach(kw => {
                                const normalizedKw = normalizeText(kw);
                                const escapedKw = normalizedKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                                const matches = fullDesc.match(new RegExp(escapedKw, "g"));
                
                                if (matches) {
                                    keywordHits += Math.min(matches.length, 5);
                                    uniqueHits += 1;
                                }
                            });
                
                            const hasBabiesScope = isBabiesSearch && (
                                getGenderScope(item)?.includes("Babies") ||
                                fullDesc.includes("babies") ||
                                fullDesc.includes("infant")
                            );
                            
                
                            const exactCategoryPhraseMatch =
                                fullDesc.includes(productCategoryNormalized);
                
                            const synonyms = CATEGORY_SYNONYMS[productCategory] || [];
                
                            return {
                                item,
                                keywordHits,
                                uniqueHits,
                                hasBabiesScope,
                                exactCategoryPhraseMatch,
                
                                isLeaf:
                                    isExactProductAtLeaf(item, productCategoryNormalized) ||
                                    synonyms.some(s =>
                                        isExactProductAtLeaf(item, normalizeText(s))
                                    ),
                
                                isParent: isMatchInParent(item, productCategoryNormalized)
                            };
                        });
                
                    if (!filtered.length) {
                        document.getElementById("resultsContainer").innerHTML =
                            "<div class='no-results'>No matching HTS found</div>";
                        return;
                    }
                
                    /* 🔑 STEP 4: SPLIT RESULTS */
                    const primaryResults = [];
                    const relatedResults = [];
                
                    filtered.forEach(r => {
                
                        const categoryLeaf = getCategoryLeaf(productCategory);
                        const isStrongSingleNodeCategory =
                            isSingleNodeStrongCategory(categoryLeaf) &&
                            (r.isLeaf || r.isParent);
                
                        const derivedScope = getCategoryScope(productCategory);
                        const isScopeStrong =
                            derivedScope && hasScopeInHierarchy(r.item, derivedScope);
                
                        if (
                            r.isLeaf ||
                            r.exactCategoryPhraseMatch ||
                            isStrongSingleNodeCategory ||
                            (isScopeStrong && r.keywordHits >= 1) ||
                            (isBabiesSearch && r.keywordHits >= 2 && r.hasBabiesScope)

                        ) {
                            primaryResults.push(r);
                        } else {
                            relatedResults.push(r);
                        }
                    });
                
                    /* 🔑 STEP 5: SORT — CATEGORY FIRST */
                    primaryResults.sort((a, b) => {
                
                        if (a.exactCategoryPhraseMatch !== b.exactCategoryPhraseMatch) {
                            return b.exactCategoryPhraseMatch - a.exactCategoryPhraseMatch;
                        }
                
                        if (isBabiesSearch && a.hasBabiesScope !== b.hasBabiesScope) {
                            return b.hasBabiesScope - a.hasBabiesScope;
                        }
                        
                
                        if (b.keywordHits !== a.keywordHits) {
                            return b.keywordHits - a.keywordHits;
                        }
                
                        if (b.uniqueHits !== a.uniqueHits) {
                            return b.uniqueHits - a.uniqueHits;
                        }
                
                        const rank = r => r.isLeaf ? 1 : r.isParent ? 2 : 3;
                        return rank(a) - rank(b);
                    });
                
                    /* 🔑 STEP 6: DISPLAY */
                    displayResults(
                        primaryResults.map(r => r.item),
                        relatedResults.map(r => r.item),
                        getRateType(exportingCountry),
                        keywordList
                    );
                }
                

                    function clearResults() {
                        document.getElementById('resultsContainer').innerHTML =
                            '<div class="no-results">Filters reset. Please select category and country.</div>';
                    }

                    function highlightText(
                                text,
                                searchWords = [],
                                genderWords = [],
                                fabricWords = [],
                                featureWords = []
                            ) {
                                  if (!highlightEnabled) {
                                        return text;
                                    }

                                let highlighted = text;

                                // 🔍 Search keywords
                                searchWords.forEach(word => {
                                    const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi');
                                    highlighted = highlighted.replace(regex, '<span class="highlight-search">$1</span>');
                                });

                                // 🚻 Gender
                                genderWords.forEach(word => {
                                    const regex = new RegExp(`\\b(${escapeRegExp(word)})(['’]s)?\\b`, 'gi');
                                    highlighted = highlighted.replace(regex, '<span class="highlight-gender">$&</span>');
                                });

                                // 🧵 Fabric
                                fabricWords.forEach(word => {
                                    const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi');
                                    highlighted = highlighted.replace(
                                        regex,
                                        '<span class="highlight-fabric">$1</span>'
                                    );
                                });

                                // ⭐ FEATURE (NEW)
                                featureWords.forEach(word => {
                                    const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi');
                                    highlighted = highlighted.replace(
                                        regex,
                                        '<span class="highlight-feature">$1</span>'
                                    );
                                });

                                return highlighted;
                            }

                    function getDirectChildren(parentItem) {
                                const parentIndex = masterData.indexOf(parentItem);
                                const parentIndent = parseInt(parentItem.indent);
                                const children = [];

                                for (let i = parentIndex + 1; i < masterData.length; i++) {
                                    const current = masterData[i];
                                    const indent = parseInt(current.indent);

                                    if (indent <= parentIndent) break;   // stop at sibling/ancestor
                                    if (indent === parentIndent + 1) {
                                        children.push(current);
                                    }
                                }
                                return children;
                            }


                            function renderHTSHierarchy(htsCode) {
                                const leaf = masterData.find(e => e.htsno === htsCode);
                                if (!leaf) return;

                                const path = getHierarchyPath(leaf); // array of nodes from root → leaf
                                const container = document.getElementById("htsHierarchyContainer");
                                container.innerHTML = "";

                                path.forEach((node, idx) => {
                                    const hasChildren = getDirectChildren(node).length > 0;

                                    const div = document.createElement("div");
                                    div.className = `hts-node indent-${idx}`;

                                    // check if this node is in the path to the final HTS
                                    const isLeaf = idx === path.length - 1;

                                    div.innerHTML = `
                                        ${hasChildren
                                            ? `<span class="hts-toggle" title="Expand / Collapse">${ICON_PLUS}</span>`
                                            : `<span class="hts-spacer"></span>`}
                                        <span class="hts-code" style="font-weight:${isLeaf ? 'bold' : 'normal'}; color:${isLeaf ? '#4d6dfd' : '#333'}">
                                            ${node.htsno || ""}
                                        </span>
                                        <span class="hts-desc"
                                            style="
                                                font-weight: ${isLeaf ? 'bold' : 'normal'};
                                                color: ${isLeaf ? '#4d6dfd' : '#333'};
                                            "
                                            >
                                            ${node.description}
                                        </span>
                                    `;

                                    if (hasChildren) {
                                        const childContainer = document.createElement("div");
                                        childContainer.className = "hts-children";
                                        childContainer.style.display = "none";
                                        div.appendChild(childContainer);

                                        const toggle = div.querySelector(".hts-toggle");
                                        toggle.addEventListener("click", (e) => {
                                            e.stopPropagation();

                                            const isOpen = childContainer.style.display === "block";
                                            childContainer.style.display = isOpen ? "none" : "block";
                                            toggle.innerHTML = isOpen ? ICON_PLUS : ICON_MINUS;

                                            if (!isOpen && childContainer.dataset.loaded !== "true") {
                                                childContainer.dataset.loaded = "true";

                                                const children = getDirectChildren(node);
                                                children.forEach(c => {
                                                    const childDiv = document.createElement("div");
                                                    childDiv.className = `hts-node indent-${idx + 1}`;

                                                    const isChildLeaf = c.htsno === htsCode; // final leaf?

                                                    childDiv.innerHTML = `
                                                        <div class="hts-row">
                                                            <span class="hts-spacer"></span>
                                                            <span class="hts-code" style="font-weight:${isChildLeaf ? 'normal' : 'normal'}">
                                                                ${c.htsno || ""}
                                                            </span>
                                                            <span class="hts-desc" ${isChildLeaf ? '' : ''}>
                                                                ${c.description}
                                                            </span>
                                                        </div>
                                                    `;
                                                    childContainer.appendChild(childDiv);
                                                });
                                            }
                                        });
                                    }

                                    container.appendChild(div);
                                });
                            }

                    function highlightInheritedParts(fullDescription, itemDescription, searchWords,genderTerms = [],fabricTerms = [],featureTerms = []) {

                        if (!highlightEnabled) {
                            return fullDescription;
                        }
                        const parts = fullDescription.split(' > ');
                        let highlightedParts = [];

                        const itemDescIndex = parts.findIndex(part =>
                            part.trim().toLowerCase() === itemDescription.trim().toLowerCase()
                        );

                        parts.forEach((part, index) => {
                            let highlightedPart = part;

                            // Pass genderTerms along with searchWords
                            highlightedPart = highlightText(
                                highlightedPart,
                                searchWords,
                                genderTerms,
                                fabricTerms,
                                featureTerms
                            );

                            if (index < itemDescIndex && itemDescIndex !== -1) {
                                if (!highlightedPart.includes('highlight-search')) {
                                    highlightedPart = `<span class="highlight-inherited">${highlightedPart}</span>`;
                                } else {
                                    highlightedPart = highlightedPart.replace(
                                        /([^>]+?)(?=<span class="highlight-search">|$)/g,
                                        (match) => match.trim() ? `<span class="highlight-inherited">${match}</span>` : match
                                    );
                                }
                            }
                            highlightedParts.push(highlightedPart);
                        });

                        return highlightedParts.join(' > ');
                    }

                function normalizeText(str) {
                return str
                    .toLowerCase()
                    .replace(/[\(\)\d]/g, '')  // remove parentheses and numbers
                    .replace(/\s+/g, ' ')       // collapse multiple spaces
                    .trim();
                    }

                function escapeRegExp(string) {
                    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
                
                function displayResults(primaryResults, secondaryResults, rateType, searchWords) {
                        const container = document.getElementById('resultsContainer');
                        const totalResults = primaryResults.length + secondaryResults.length;
                        

                        if (totalResults === 0) {
                            container.innerHTML = '<div class="no-results">No results found for the selected filters</div>';
                            return;
                        }

                        let html = '<div class="results-header">';
                        html += `<div class="count-breakdown">`;
                        html += `<div class="count-item">Total Results: ${totalResults}</div>`;
                        html += `<div class="count-item primary">Match Results: ${primaryResults.length}</div>`;
                        html += `<div class="count-item secondary">Related Results: ${secondaryResults.length}</div>`;
                        html += `</div>`;
                        html += '</div>';

                        // Gender terms to highlight
                        // Correct gender terms from GENDER_TERMS
                        const genderTerms =
                            selectedFilters.gender && selectedFilters.gender !== 'All'
                            ? GENDER_TERMS[selectedFilters.gender]
                            : [];
                        
                        const fabricTerms =
                            selectedFilters.fabric && selectedFilters.fabric !== 'All'
                                ? [normalizeText(selectedFilters.fabric)]
                                : [];
                        const featureTerms =
                            selectedFilters.feature && selectedFilters.feature !== 'All'
                                ? [normalizeText(selectedFilters.feature)]
                                : [];


                        if (primaryResults.length > 0) {
                            html += `
                                <table class="results-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>HTS Code</th>
                                            <th>Description</th>
                                            <th>Rate Type</th>
                                            <th>Rate of Duty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                            `;

                            primaryResults.forEach((item, index) => {
                                const fullDescription = getFullDescription(item);

                                const highlightedDescription = highlightInheritedParts(
                                    fullDescription,
                                    item.description,
                                    searchWords,
                                    genderTerms,
                                    fabricTerms,
                                    featureTerms
                                );


                                const rateInfo = getRate(item, rateType);

                                const leafGenders = getGenderFromLeafAndParent(item);

                                // 1️⃣ Normalize description for gender detection
                                const normalizedDesc = fullDescription
                                    .replace(/\(\d+\)/g, '')   // remove numeric codes like (359)
                                    .replace(/>/g, '')         // remove > symbols
                                    .replace(/[':]/g, '')      // remove quotes and colons
                                    .toLowerCase();            // lowercase for easier matching

                                // 2️⃣ Detect if description already contains any gender
                                const genders = ['men','women','boys','girls'];
                                const descriptionHasGender = genders.some(g => normalizedDesc.includes(g));

                                // 3️⃣ Only add badge if description doesn't already include that gender
                                const uniqueGenders = leafGenders?.filter(g => !normalizedDesc.includes(g.toLowerCase()));
                                const genderBadge = !descriptionHasGender && uniqueGenders && uniqueGenders.length
                                    ? `<span class="gender-badge">${uniqueGenders.join(" / ")}</span>`
                                    : '';

                                html += `
                                    <tr
                                        class="hts-row"
                                        data-description="${normalizeText(fullDescription)}"
                                        onclick='showDetails(${JSON.stringify(item).replace(/'/g, "&apos;")}, "${rateType}")'
                                    >
                                        <td class="row-number">${index + 1}</td>
                                        <td>
    <div class="hts-code-wrapper">
        <a
            href="https://hts.usitc.gov/search?query=${encodeURIComponent(item.htsno)}"
            target="_blank"
            class="hts-code-link"
            title="Click to View HTS Code Structure on USITC Website"
            onclick="event.stopPropagation()"
        >
            ${item.htsno}
        </a>

        <button
            class="hts-info-btn"
            title="Click to View Details"
            onclick='event.stopPropagation(); showDetails(${JSON.stringify(item).replace(/'/g, "&apos;")}, "${rateType}")'
        >
            i
        </button>
    </div>
</td>

                                        <td>
                                            ${highlightedDescription}
                                            ${genderBadge}
                                        </td>
                                        <td>${rateType}</td>
                                        <td>${rateInfo.value}</td>
                                    </tr>
                                `;
                            });


                            html += '</tbody></table>';
                        }

                        if (secondaryResults.length > 0) {
                            html += `
                                <div class="other-results">
                                    <button class="other-results-toggle" onclick="toggleOtherResults()">
                                        <span>Related results (${secondaryResults.length})</span>
                                        <span class="arrow">▼</span>
                                    </button>
                                    <div class="other-results-content" id="otherResultsContent">
                                        <table class="results-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>HTS Code</th>
                                                    <th>Description</th>
                                                    <th>Rate Type</th>
                                                    <th>Rate</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                            `;

                            secondaryResults.forEach((item, index) => {
                                const fullDescription = getFullDescription(item);
                                const highlightedDescription = highlightInheritedParts(fullDescription,item.description,searchWords,genderTerms,fabricTerms,featureTerms);
                                const rateInfo = getRate(item, rateType);

                                const leafGenders = getGenderFromLeafAndParent(item);

                                // 1️⃣ Normalize description for gender detection
                                const normalizedDesc = fullDescription
                                    .replace(/\(\d+\)/g, '')   // remove numeric codes like (359)
                                    .replace(/>/g, '')         // remove > symbols
                                    .replace(/[':]/g, '')      // remove quotes and colons
                                    .toLowerCase();            // lowercase for easier matching

                                // 2️⃣ Detect if description already contains any gender
                                const genders = ['men','women','boys','girls'];
                                const descriptionHasGender = genders.some(g => normalizedDesc.includes(g));

                                // 3️⃣ Only add badge if description doesn't already include that gender
                                const uniqueGenders = leafGenders?.filter(g => !normalizedDesc.includes(g.toLowerCase()));
                                const genderBadge = !descriptionHasGender && uniqueGenders && uniqueGenders.length
                                    ? `<span class="gender-badge">${uniqueGenders.join(" / ")}</span>`
                                    : '';

                                html += `
                                    <tr onclick='showDetails(${JSON.stringify(item).replace(/'/g, "&apos;")}, "${rateType}")'>
                                        <td class="row-number">${index + 1}</td>
                                        <td>
    <div class="hts-code-wrapper">
        <a
            href="https://hts.usitc.gov/search?query=${encodeURIComponent(item.htsno)}"
            target="_blank"
            class="hts-code-link"
            title="Click to View HTS Code Structure on USITC Website"
            onclick="event.stopPropagation()"
        >
            ${item.htsno}
        </a>

        <button
            class="hts-info-btn"
            title="Click to View Details"
            onclick='event.stopPropagation(); showDetails(${JSON.stringify(item).replace(/'/g, "&apos;")}, "${rateType}")'
        >
            i
        </button>
    </div>
</td>

                                        <td>${highlightedDescription}</td>
                                        <td>${rateType}</td>
                                        <td>${rateInfo.value}</td>
                                    </tr>
                                `;
                            });

                            html += `
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            `;
                        }

                        container.innerHTML = html;
                    }

                function toggleOtherResults() {
                    const content = document.getElementById('otherResultsContent');
                    const toggle = document.querySelector('.other-results-toggle');
                    if (content.classList.contains('show')) {
                        content.classList.remove('show');
                        toggle.classList.remove('expanded');
                    } else {
                        content.classList.add('show');
                        toggle.classList.add('expanded');
                    }
                }
  
                function showDetails(item, rateType) {
                        const modal = document.getElementById('detailModal');
                        const modalBody = document.getElementById('modalBody');
                        const htsCode = item.htsno;

                        let rateField = '';
                        if (rateType === 'Column 2') rateField = 'other';
                        else if (rateType === 'Special') rateField = 'special';
                        else rateField = 'general';

                        let rate = getRate(item, rateType).value;
                        let isInherited = false;
                        let inheritedFrom = null;

                        let breakdownHTML = '<div>';
                       

                        // Build hierarchy items
                        const hierarchyItems = [];
                        let currentIndent = parseInt(item.indent);
                        let currentIndex = masterData.indexOf(item);

                        for (let i = currentIndex; i >= 0; i--) {
                            const checkItem = masterData[i];
                            const checkIndent = parseInt(checkItem.indent);

                            // Only add if this item has a smaller indent than the previous
                            if (checkIndent < currentIndent) {
                                hierarchyItems.unshift(checkItem);
                                currentIndent = checkIndent;
                            }

                            // Always include the current item itself once
                            if (i === currentIndex && !hierarchyItems.includes(checkItem)) {
                                hierarchyItems.unshift(checkItem);
                            }

                            if (currentIndent === 0) break;
                        }

                        hierarchyItems.forEach(hierarchyItem => {
                            const indent = parseInt(hierarchyItem.indent);
                            const indentClass = `indent-${indent}`;
                            const isRateSource = inheritedFrom && hierarchyItem.htsno === inheritedFrom.htsno;

                            breakdownHTML += `<div class="hts-breakdown-item ${indentClass} ${isRateSource ? 'highlight-inherited' : ''}">
                                ${hierarchyItem.htsno ? `<strong>${hierarchyItem.htsno}:</strong> ` : ''}
                                ${hierarchyItem.description}
                                ${isRateSource ? ` <span class="rate-inherited">(Rate inherited from here)</span>` : ''}
                            </div>`;
                        });

                        breakdownHTML += '</div>';

                        // Add the expandable hierarchy container **before inserting into modal**
                        breakdownHTML += `
                            <div id="htsHierarchyContainer" style="margin-top:10px;">
                                <!-- Expandable hierarchy will be rendered here -->
                            </div>
                        `;

                        const rateHTML = `
                            <div class="rate-info">
                                <div><strong>Rate Type:</strong> ${rateType}</div>
                                <div><strong>Rate:</strong> ${rate} ${isInherited ? '<span class="rate-inherited">(inherited from parent)</span>' : ''}</div>
                                ${item.units && item.units.length > 0 ? `<div><strong>Units:</strong> ${item.units.join(', ')}</div>` : ''}
                            </div>
                        `;

                        // Insert everything into modalBody **once**
                        modalBody.innerHTML = breakdownHTML + rateHTML;

                        // Render expandable hierarchy inside the container
                        renderHTSHierarchy(htsCode);

                        modal.style.display = 'block';
                    }


                function closeModal() {
                    document.getElementById('detailModal').style.display = 'none';
                }

                window.onclick = function (event) {
                    const modal = document.getElementById('detailModal');
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                };

                let alertTooltip;

function showCategoryAlert(e, message) {
    if (!alertTooltip) {
        alertTooltip = document.createElement("div");
        alertTooltip.className = "category-alert-tooltip";
        document.body.appendChild(alertTooltip);
    }

    alertTooltip.innerHTML = message;
    alertTooltip.style.left = `${e.pageX + 12}px`;
    alertTooltip.style.top = `${e.pageY + 12}px`;

    requestAnimationFrame(() => {
        alertTooltip.classList.add("show");
    });
}

function hideCategoryAlert() {
    if (alertTooltip) {
        alertTooltip.classList.remove("show");
    }
}

// Position an info tooltip intelligently: prefer placing adjacent to the icon
// if there is room, otherwise clamp to viewport (right/left/center).
function positionInfoTooltip(ic) {
    const tooltip = ic.querySelector('.info-tooltip');
    if (!tooltip) return;

    // temporarily disable pointerEvents while measuring
    tooltip.style.pointerEvents = 'none';

    requestAnimationFrame(() => {
        const iconRect = ic.getBoundingClientRect();
        const tipRect = tooltip.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 8;

        // Desired inline placement: align left edge of tooltip with icon left
        let inlineLeft = Math.round(iconRect.left);
        let inlineTop = Math.round(iconRect.bottom + 6);

        const fitsInlineHoriz = inlineLeft >= margin && (inlineLeft + tipRect.width + margin <= vw);
        const fitsInlineVert = (inlineTop + tipRect.height + margin <= vh);

        let left, top;

        if (fitsInlineHoriz && fitsInlineVert) {
            // Enough space: render adjacent (like before)
            left = inlineLeft;
            top = inlineTop;
        } else {
            // Fallback: prefer placing to the right of the icon
            left = iconRect.right + margin;
            if (left + tipRect.width + margin > vw) {
                // try left side
                if (iconRect.left - margin - tipRect.width > margin) {
                    left = iconRect.left - margin - tipRect.width;
                } else {
                    // center over icon horizontally within viewport
                    left = Math.max(margin, Math.min(vw - tipRect.width - margin, Math.round(iconRect.left + (iconRect.width / 2) - (tipRect.width / 2))));
                }
            }

            // Vertical placement: prefer below
            top = iconRect.bottom + 6;
            if (top + tipRect.height + margin > vh) {
                if (iconRect.top - margin - tipRect.height > margin) {
                    top = iconRect.top - margin - tipRect.height;
                } else {
                    top = Math.max(margin, vh - tipRect.height - margin);
                }
            }
        }

        tooltip.style.position = 'fixed';
        tooltip.style.left = `${Math.round(left)}px`;
        tooltip.style.top = `${Math.round(top)}px`;
        tooltip.style.pointerEvents = '';
    });
}

function toggleInfo(icon) {
    const isLocked = lockedInfoIcon === icon;

    // Close any previously locked info
    if (lockedInfoIcon && lockedInfoIcon !== icon) {
        lockedInfoIcon.classList.remove("open", "active");
    }

    if (isLocked) {
        // Unlock & close
        icon.classList.remove("open", "active");
        lockedInfoIcon = null;
        openInfoIcon = null;
        return;
    }

    // Lock this one
    icon.classList.add("open", "active");
    lockedInfoIcon = icon;
    openInfoIcon = icon;

    positionInfoTooltip(icon);
}

function showInfoOnHover(icon) {
    if (lockedInfoIcon) return; // ❌ don’t interfere with click-locked

    icon.classList.add("open");
    openInfoIcon = icon;
    positionInfoTooltip(icon);
}

function hideInfoOnHover(icon) {
    if (lockedInfoIcon === icon) return; // ❌ keep open if locked

    icon.classList.remove("open");
    openInfoIcon = null;
}


document.addEventListener("click", (e) => {
    if (!e.target.closest(".info-icon")) {
        document.querySelectorAll(".info-icon.open").forEach(icon => {
            icon.classList.remove("open");
        });
    }
});

document.addEventListener('mouseover', e => {
    const icon = e.target.closest('.info-icon');
    if (!icon) return;
    const tooltip = icon.querySelector('.info-tooltip');
    if (!tooltip) return;
    // Only reposition when tooltip is visible — either via active class or hover capability
    if (icon.classList.contains('active') || window.matchMedia('(hover: hover)').matches) {
        requestAnimationFrame(() => positionInfoTooltip(icon));
    }
});

// Also reposition on scroll because fixed placement depends on viewport
window.addEventListener("scroll", () => {
    document.querySelectorAll(".info-icon.open").forEach(icon => {
        positionInfoTooltip(icon);
    });
}, { passive: true });


document.addEventListener("mouseover", e => {
    const row = e.target.closest(".hts-row");
    if (!row) return;

    const rule = getActiveCategoryAlert();
    if (!rule) return;

    const rowText = row.dataset.description || "";

    const matched = rule.keywords.some(k =>
        new RegExp(`\\b${k}\\b`, "i").test(rowText)
    );

    if (matched) {
        showCategoryAlert(e, rule.message);
    }
});

document.addEventListener("mousemove", e => {
    if (alertTooltip?.classList.contains("show")) {
        alertTooltip.style.left = `${e.pageX + 12}px`;
        alertTooltip.style.top = `${e.pageY + 12}px`;
    }
});

document.addEventListener("mouseout", e => {
    if (e.target.closest(".hts-row")) {
        hideCategoryAlert();
    }
});

document.querySelectorAll(".filter-trigger").forEach(trigger => {
    trigger.addEventListener("click", e => {
        e.stopPropagation();

        // 🔑 FORCE close category when opening any filter
        if (categoryMenuOpen) {
            closeAllCategoryMenus();
        }

        toggleFilterMenu(trigger); // your existing logic
    });
});

document.addEventListener("click", (e) => {
    // Click completely outside category + filters
    if (
        !e.target.closest(".category-trigger") &&
        !e.target.closest(".category-menu") &&
        !e.target.closest(".filter-trigger") &&
        !e.target.closest(".filter-menu")
    ) {
        closeAllCategoryMenus();
    }
});



                document.addEventListener("click", e => {
                    const btn = e.target.closest(".copy-hts-btn");
                    if (!btn) return;

                    e.preventDefault();
                    e.stopPropagation();

                    const code = btn.dataset.hts;

                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(code)
                            .then(() => showCopied(btn))
                            .catch(() => fallbackCopy(code, btn));
                    } else {
                        fallbackCopy(code, btn);
                    }
                });

                document.querySelectorAll(".info-tooltip").forEach(tip => {
                    tip.addEventListener("click", e => {
                        e.stopPropagation();
                    });
                });

              
                function toggleFilterMenu(event, filterType) {
                    event.stopPropagation();
                    
                    const menu = document.getElementById(filterType + 'Menu');
                    
                    // Close other menus
                    if (openFilterMenu && openFilterMenu !== menu) {
                        openFilterMenu.classList.remove('show');
                    }
                    
                    // Toggle current menu
                    menu.classList.toggle('show');
                    openFilterMenu = menu.classList.contains('show') ? menu : null;
                    
                    // Position menu near trigger
                    positionFilterMenu(filterType);
                }

                function buildFilterMenu(filterType) {
                    const menu = document.getElementById(filterType + 'Menu');
                    if (!menu) return;
                    
                    const items = FILTER_DATA[filterType] || [];
                    const currentValue = selectedFilters[filterType] || 'All';
                    
                    menu.innerHTML = '';
                    
                    items.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'filter-menu-item';
                        if (item.value === currentValue) {
                            div.classList.add('selected');
                        }
                        div.textContent = item.label;
                        div.onclick = (e) => {
                            e.stopPropagation();
                            if (e.currentTarget.classList.contains('disabled')) return;
                            selectFilterItem(filterType, item.value, item.label);
                        };
                        menu.appendChild(div);
                    });
                }

                function selectFilterItem(filterType, value, label) {
                    selectedFilters[filterType] = value;
                    
                    const trigger = document.getElementById(filterType + 'Trigger');
                    // Don't add arrow if label already has it
                    trigger.textContent = label.includes('▾') ? label : label + ' ▾';
                    
                    // Close menu
                    const menu = document.getElementById(filterType + 'Menu');
                    menu.classList.remove('show');
                    openFilterMenu = null;

                    // Rebuild menu so the selected item is marked when reopened
                    if (filterType === 'country') {
                        buildCountriesFilter();
                    } else {
                        buildFilterMenu(filterType);
                    }
                    
                    // Special handling for country filter
                    if (filterType === 'country') {
                        selectedFilters.exportingCountry = value;
                        attemptAutoSearch();
                        return;
                    }
                    
                    // Trigger search if needed
                    if (filterType === 'material') {
                        enforceMaterialNeutralUI(selectedFilters.category);
                        searchHTSByFilters();
                    }else if (filterType === 'gender') {

                        // 🔥 RESET category when gender changes
                        selectedFilters.uiMainCategory = '';
                        selectedFilters.category = '';

                        const trigger = document.querySelector(".category-trigger");
                        if (trigger) trigger.textContent = "Select Category ▾";

                        closeAllCategoryMenus();   // 🔥 add this

                        // 🔥 REBUILD CATEGORY MENU BASED ON GENDER
                        buildCategoryMenu();

                        // run search
                        searchHTSByFilters();
                    } else if (filterType === 'fabric') {
                        searchHTSByFilters();
                    } else if (filterType === 'feature') {
                        searchHTSByFilters();
                    }
                }

                function initializeFilterMenus() {
                    ['material', 'gender', 'importingCountry', 'fabric', 'feature'].forEach(filterType => {
                        buildFilterMenu(filterType);
                    });
                    
                    // Build countries filter after countries are loaded
                    if (allCountries.length > 0) {
                        buildCountriesFilter();
                    }
                }

                function buildCountriesFilter() {
                    const menu = document.getElementById('countryMenu');
                    const currentValue = selectedFilters.country || 'Select Country';
                    
                    menu.innerHTML = '';
                    
                    // Add "Select Country" option
                    const selectOption = document.createElement('div');
                    selectOption.className = 'filter-menu-item';
                    selectOption.textContent = 'Select Country';
                    selectOption.onclick = () => selectFilterItem('country', '', 'Select Country');
                    menu.appendChild(selectOption);
                    
                    allCountries.forEach(country => {
                        const div = document.createElement('div');
                        div.className = 'filter-menu-item';
                        if (country.name === currentValue) {
                            div.classList.add('selected');
                        }
                        div.textContent = country.name + (country.type ? ` (${country.type})` : '');
                        div.onclick = () => selectFilterItem('country', country.name, country.name);
                        menu.appendChild(div);
                    });
                }

                // Close menus when clicking outside
                document.addEventListener('click', () => {
                    if (openFilterMenu) {
                        openFilterMenu.classList.remove('show');
                        openFilterMenu = null;
                    }
                });

                document.addEventListener("click", e => {
                    if (!e.target.closest(".info-icon") && lockedInfoIcon) {
                        lockedInfoIcon.classList.remove("open", "active");
                        lockedInfoIcon = null;
                        openInfoIcon = null;
                    }
                });
                
// 🌍 expose UI functions for HTML onclick handlers
window.toggleFilterMenu = toggleFilterMenu;
window.resetAllFilters = resetAllFilters;
window.toggleHighlight = toggleHighlight;
window.toggleInfo = toggleInfo;
window.showInfoOnHover = showInfoOnHover;
window.hideInfoOnHover = hideInfoOnHover;
window.importJSON = importJSON;
window.closeModal = closeModal;
window.showDetails = showDetails;
window.copyHTSCode = copyHTSCode;
window.toggleOtherResults = toggleOtherResults;
window.filterFabricRules = filterFabricRules;


    initializeCountries();
    buildCategoryMenu();
    restoreSelectedCategory();

    initializeFilterMenus();
    loadFlatFile();
    checkAdminMode();

