import uniq from 'lodash/uniq';
import orderBy from 'lodash/orderBy';
import isArray from 'lodash/isArray';
import { toPresentationData } from './../transformations/contagi';

//array al contrario
export const sortedArray = (dati) => orderBy([...dati], ['data'], ['desc']);

//formatto i dati per una maggiore chiarezza
export const formatNumber = (num) => new Intl.NumberFormat('it-IT').format(num);

/**
 * split data by region
 * @param {source} dati 
 */
export const splitDataByRegion = (dati) => {
    const splittedData = null;
    if(dati && isArray(dati) && dati.length > 0) {
        const regionList = uniq(dati.map(item => item.denominazione_regione));
        if(regionList && isArray(regionList)) {
            regionList.sort();

            const regionDictionary = {};
            regionList.forEach(region => { 
                regionDictionary[region] = toPresentationData(dati.filter(item => item.denominazione_regione === region));
            });
            return regionDictionary;
        }
    } else {
        console.warn('splitDataByRegion - no data to split');
    }
    return splittedData;
};

/**
 * Retrieve first date of source
 * @param {source} dati 
 */
export const firstDate = (dati) => {
    if (dati && dati.length > 0) {
        let sorted = sortedArray(dati);
        // prima data caricata
        return sorted ? sorted[sorted.length - 1].data : null;
    } else {
        return null;
    }
};

/**
 * Retrieve last date of source
 * @param {source} dati 
 */
export const lastDate = (dati) => {
    if (dati && dati.length > 0) {
        let sorted = sortedArray(dati);
        // prima data caricata
        return sorted ? sorted[0].data : null;
    } else {
        return null;
    }
};


export const lastUpdated = (dati) => {
    if (dati.length > 0) {
        let sorted = sortedArray(dati)
        // ultima data caricata
        let lastUpdated = sorted[0].data
        // regione con più casi
        let lastUpdatedData = sorted.filter(el => el.data === lastUpdated).sort((a, b) => b.nuovi_positivi - a.nuovi_positivi)
        return lastUpdatedData
    } else {
        return []
    }
};

export const formatData = lastUpdated => lastUpdated
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");
;

export const totalCases = (datiToday, trend) => {
    if (datiToday.length > 0) {
        let totalCases = datiToday.map(el => el[trend]).reduce((t, n) => t + n);
        return formatNumber(totalCases);
    }
};

//perendo i giorni senza doppioni
export const setDays = (dati) => dati.length > 0 ? Array.from(new Set(sortedArray(dati).map(el => el.data))).reverse() : null;

// //casi per ogni giorno e le data
export const totalsForDays = (dati, trend) => dati.length > 0 ? setDays(dati).map(el => [el, sortedArray(dati).filter(i => i.data === el).map(e => e[trend]).reduce((t, n) => t + n)]) : null;