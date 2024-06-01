class CSSPropertyGetter{
    static getProperty(propertyName: string):string{
        return getComputedStyle(document.documentElement).getPropertyValue(propertyName);
    }
}

export default CSSPropertyGetter;