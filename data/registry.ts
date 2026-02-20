import type { BuildingData } from "@/types/shared";

// Import element data files
// #region capital
import { smallHome } from "@/data/capital/homes/small_home";
import { averageHome } from "@/data/capital/homes/average_home";
import { luxuriousHome } from "@/data/capital/homes/luxurious_home";
import { ruralFarm } from "@/data/capital/farms/rural_farm";
import { domesticFarm } from "@/data/capital/farms/domestic_farm";
import { luxuriousFarm } from "@/data/capital/farms/luxurious_farm";
import { littleCultureSite } from "@/data/capital/cultural_sites/little";
import { compactCultureSite } from "@/data/capital/cultural_sites/compact";
import { moderateCultureSite } from "@/data/capital/cultural_sites/moderate";
import { largeCultureSite } from "@/data/capital/cultural_sites/large";
import { luxuriousCultureSite } from "@/data/capital/cultural_sites/luxurious";

import { infantryBarracks } from "@/data/capital/barracks/infantry_barracks";
import { rangedBarracks } from "@/data/capital/barracks/ranged_barracks";
import { cavalryBarracks } from "@/data/capital/barracks/calvary_barracks";
import { heavyInfantryBarracks } from "@/data/capital/barracks/heavy_infantry_barracks";
import { siegeBarracks } from "@/data/capital/barracks/siege_barracks";

import { artisanWorkshop } from "@/data/capital/workshops/artisan";
import { stoneMasonWorkshop } from "@/data/capital/workshops/stone_mason";
import { tailorWorkshop } from "@/data/capital/workshops/tailor";

import { scribeWorkshop } from "@/data/capital/workshops/scribe";
import { carpenterWorkshop } from "@/data/capital/workshops/carpenter";
import { spiceMerchantWorkshop } from "@/data/capital/workshops/spice_merchant";

import { alchemistWorkshop } from "@/data/capital/workshops/alchemist";
import { jewelerWorkshop } from "@/data/capital/workshops/jeweler";
import { glassblowerWorkshop } from "@/data/capital/workshops/glassblower";

import { seafarerHouse } from "@/data/capital/harbor_houses/seafarer_house";
import { luxuriousSeafarerHouse } from "@/data/capital/harbor_houses/luxurious_seafarer_house";

import { pier } from "@/data/capital/port_facilities/pier";
import { lighthouse } from "@/data/capital/port_facilities/lighthouse";

import { shipyards } from "@/data/capital/ships/shipyards";

import { commonWarehouse } from "@/data/capital/warehouses/common_warehouse";
import { largeWarehouse } from "@/data/capital/warehouses/large_warehouse";

// #endregion

// #region egypt
import {
  egyptSmallHome,
  egyptAverageHome,
  egyptLuxuriousHome,
} from "@/data/allieds/egypt/homes";
import {
  egyptGoldMine,
  egyptLuxuriousGoldMine,
} from "@/data/allieds/egypt/gold_mines";
import {
  egyptPapyrusField,
  egyptLuxuriousPapyrusField,
} from "@/data/allieds/egypt/papyrus_fields";
import {
  egyptGoldsmith,
  egyptPapyrusPress,
} from "@/data/allieds/egypt/workshops";
import {
  egyptIrrigationStation,
  egyptSmallWell,
  egyptChannel,
  egyptWaterPump,
  egyptOasis,
  egyptFountain,
} from "@/data/allieds/egypt/irrigations";
// #endregion

// #region china
import {
  chinaRiceFarm,
  chinaLuxuriousRiceFarm,
} from "@/data/allieds/china/rice_farms";
import {
  chinaSmallHome,
  chinaAverageHome,
  chinaLuxuriousHome,
} from "@/data/allieds/china/homes";
import {
  chinaClayProcessor,
  chinaPorcelainWorkshop,
  chinaSilkWorkshop,
  chinaThreadProcessor,
} from "@/data/allieds/china/workshops";
// #endregion

// #region maya
import {
  mayaWorkerHome,
  mayaPriestHome,
  mayaLuxuriousHome,
} from "@/data/allieds/maya/homes";
import {
  mayaAverageAviary,
  mayaLuxuriousAviary,
} from "@/data/allieds/maya/aviaries";
import {
  mayaJadeQuarry,
  mayaLuxuriousQuarry,
  mayaObsidianQuarry,
} from "@/data/allieds/maya/quarries";
import {
  mayaSmallRitualSite,
  mayaAverageRitualSite,
  mayaLuxuriousRitualSite,
} from "@/data/allieds/maya/ritual_sites";
import {
  mayaChronicler,
  mayaMaskSculptor,
  mayaCeremonyOutfitter,
  mayaRitualCarver,
  mayaLuxuriousWorkshop,
} from "@/data/allieds/maya/workshops";
// #endregion

// #region viking
import { vikingBeehive } from "@/data/allieds/vikings/beehives";
import {
  vikingFishingPier,
  vikingLuxuriousFishingPier,
} from "@/data/allieds/vikings/fishing_pier";
import {
  vikingExpeditionPier,
  vikingSailorPort,
  vikingLuxuriousSailorPort,
  vikingTavern,
} from "@/data/allieds/vikings/workshops";
import {
  vikingWorkerHome,
  vikingSailorHome,
  vikingLuxuriousHome,
} from "@/data/allieds/vikings/homes";
import {
  vikingHomeRunestone,
  vikingBeehiveRunestone,
  vikingTavernRunestone,
} from "@/data/allieds/vikings/runestones";
// #endregion

// #region arabia
import { arabiaCamelFarm } from "@/data/allieds/arabia/camel_farms";
import {
  arabiaMediumHome,
  arabiaLuxuriousHome,
} from "@/data/allieds/arabia/homes";
import {
  arabiaChannel,
  arabiaSmallWell,
  arabiaDeepWeel,
  arabiaLuxuriousNoria,
} from "@/data/allieds/arabia/irrigations";
import {
  arabiaMerchant,
  arabiaLuxuriousMerchant,
} from "@/data/allieds/arabia/merchants";
import {
  arabiaCarpetFactory,
  arabiaCoffeeBrewer,
  arabiaIncenseMaker,
  arabiaLuxuriousWorkshop,
  arabiaOilLampCrafter,
} from "@/data/allieds/arabia/workshops";
// #endregion

/**
 * Element data registry
 * Maps catalog IDs to their data
 */
export const ELEMENT_DATA_REGISTRY: Record<string, BuildingData> = {
  // capital - homes
  capital_small_home: smallHome,
  capital_average_home: averageHome,
  capital_luxurious_home: luxuriousHome,
  // capital - farms
  capital_rural_farm: ruralFarm,
  capital_domestic_farm: domesticFarm,
  capital_luxurious_farm: luxuriousFarm,
  // capital - cultural sites
  capital_little_culture_site: littleCultureSite,
  capital_compact_culture_site: compactCultureSite,
  capital_moderate_culture_site: moderateCultureSite,
  capital_large_culture_site: largeCultureSite,
  capital_luxurious_culture_site: luxuriousCultureSite,
  // capital - barracks
  capital_infantry_barracks: infantryBarracks,
  capital_ranged_barracks: rangedBarracks,
  capital_cavalry_barracks: cavalryBarracks,
  capital_heavy_infantry_barracks: heavyInfantryBarracks,
  capital_siege_barracks: siegeBarracks,
  // capital - workshops
  capital_artisan: artisanWorkshop,
  capital_tailor: tailorWorkshop,
  capital_stone_mason: stoneMasonWorkshop,
  capital_scribe: scribeWorkshop,
  capital_carpenter: carpenterWorkshop,
  capital_spice_merchant: spiceMerchantWorkshop,
  capital_alchemist: alchemistWorkshop,
  capital_jeweler: jewelerWorkshop,
  capital_glassblower: glassblowerWorkshop,
  // capital - harbor houses
  capital_seafarer_house: seafarerHouse,
  capital_luxurious_seafarer_house: luxuriousSeafarerHouse,
  // capital - port facilities
  capital_pier: pier,
  capital_lighthouse: lighthouse,
  // capital - ships
  capital_shipyard: shipyards,
  // capital - warehouses
  capital_common_warehouse: commonWarehouse,
  capital_large_warehouse: largeWarehouse,

  // egypt
  egypt_small_home: egyptSmallHome,
  egypt_average_home: egyptAverageHome,
  egypt_luxurious_home: egyptLuxuriousHome,
  egypt_gold_mine: egyptGoldMine,
  egypt_luxurious_gold_mine: egyptLuxuriousGoldMine,
  egypt_papyrus_field: egyptPapyrusField,
  egypt_luxurious_papyrus_field: egyptLuxuriousPapyrusField,
  egypt_goldsmith: egyptGoldsmith,
  egypt_papyrus_press: egyptPapyrusPress,
  egypt_irrigation_station: egyptIrrigationStation,
  egypt_small_well: egyptSmallWell,
  egypt_channel: egyptChannel,
  egypt_water_pump: egyptWaterPump,
  egypt_oasis: egyptOasis,
  egypt_fountain: egyptFountain,
  // china
  china_small_home: chinaSmallHome,
  china_average_home: chinaAverageHome,
  china_luxurious_home: chinaLuxuriousHome,
  china_rice_farm: chinaRiceFarm,
  china_luxurious_rice_farm: chinaLuxuriousRiceFarm,
  china_clay_processor: chinaClayProcessor,
  china_porcelain_workshop: chinaPorcelainWorkshop,
  china_silk_workshop: chinaSilkWorkshop,
  china_thread_processor: chinaThreadProcessor,
  // maya
  maya_worker_home: mayaWorkerHome,
  maya_priest_home: mayaPriestHome,
  maya_luxurious_home: mayaLuxuriousHome,
  maya_average_aviary: mayaAverageAviary,
  maya_luxurious_aviary: mayaLuxuriousAviary,
  maya_jade_quarry: mayaJadeQuarry,
  maya_luxurious_quarry: mayaLuxuriousQuarry,
  maya_obsidian_quarry: mayaObsidianQuarry,
  maya_small_ritual_site: mayaSmallRitualSite,
  maya_average_ritual_site: mayaAverageRitualSite,
  maya_luxurious_ritual_site: mayaLuxuriousRitualSite,
  maya_chronicler: mayaChronicler,
  maya_mask_sculptor: mayaMaskSculptor,
  maya_ceremony_outfitter: mayaCeremonyOutfitter,
  maya_ritual_carver: mayaRitualCarver,
  maya_luxurious_workshop: mayaLuxuriousWorkshop,
  // vikings
  vikings_worker_home: vikingWorkerHome,
  vikings_sailor_home: vikingSailorHome,
  vikings_luxurious_home: vikingLuxuriousHome,
  vikings_home_runestone: vikingHomeRunestone,
  vikings_beehive_runestone: vikingBeehiveRunestone,
  vikings_tavern_runestone: vikingTavernRunestone,
  vikings_expedition_pier: vikingExpeditionPier,
  vikings_sailor_port: vikingSailorPort,
  vikings_luxurious_sailor_port: vikingLuxuriousSailorPort,
  vikings_tavern: vikingTavern,
  vikings_beehive: vikingBeehive,
  vikings_fishing_pier: vikingFishingPier,
  vikings_luxurious_fishing_pier: vikingLuxuriousFishingPier,
  // arabia
  arabia_medium_home: arabiaMediumHome,
  arabia_luxurious_home: arabiaLuxuriousHome,
  arabia_camel_farm: arabiaCamelFarm,
  arabia_channel: arabiaChannel,
  arabia_small_well: arabiaSmallWell,
  arabia_deep_weel: arabiaDeepWeel,
  arabia_luxurious_noria: arabiaLuxuriousNoria,
  arabia_merchant: arabiaMerchant,
  arabia_luxurious_merchant: arabiaLuxuriousMerchant,
  arabia_carpet_factory: arabiaCarpetFactory,
  arabia_coffee_brewer: arabiaCoffeeBrewer,
  arabia_incense_maker: arabiaIncenseMaker,
  arabia_luxurious_workshop: arabiaLuxuriousWorkshop,
  arabia_oil_lamp_crafter: arabiaOilLampCrafter,
};
