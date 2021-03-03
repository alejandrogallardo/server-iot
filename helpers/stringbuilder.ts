export class StringBuilder
{
    strArray: Array<string> = new Array<string>();
    constructor()
    {

    }
    Get(nIndex:number): string
    {
        let str: any = null;
        if( (this.strArray.length > nIndex) && (nIndex >= 0) )
        {
            str = this.strArray[nIndex];
        }
        return(str);
    }
    IsEmpty(): boolean
    {
        if(this.strArray.length == 0) return true;
        return(false);
    }
    Append(str: string): void
    {
        if(str != null)
            this.strArray.push(str);
    }
    ToString(): string
    {
        let str:string = this.strArray.join("");
        return(str);
    }

    ToArrayString(delimeter: string): string
    {
        let str:string = this.strArray.join(delimeter);
        return(str);
    }

    Clear()
    {
        this.strArray.length = 0;
    }
}
