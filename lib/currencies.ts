export const Currencies = [
    {value:"USD",label:"$ Dollar",locale:"en-us"},
    {value:"EUR",label:"€ EURO",locale:"de-DE"},
    {value:"JPY",label:"¥ YEN",locale:"ja-JP"},
    {value:"GBP",label:"£ POUND",locale:"en-GB"}

];

export type Currency = (typeof Currencies)[0];
