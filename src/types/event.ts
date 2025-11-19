/**
 * StreamingDeviceType
 *
 * Enum that specifies the type of device used for streaming the event.
 *  - MOBILE: Event is streamed from a mobile device
 *  - NOTMOBILE: Event is streamed from a desktop/web-based setup
 */
export enum StreamingDeviceType {
  MOBILE = 'Mobile',
  NOTMOBILE = 'Not Mobile',
}

/**
 * Currency
 *
 * Enum containing all supported ISO 4217 currency codes for event pricing.
 * Includes major global currencies (USD, EUR, GBP) and regional currencies
 * from Africa, Asia, Middle East, Americas, and other regions.
 *  - NONE: Default/unselected currency placeholder
 */
export enum Currency {
  NONE = 'Select Currency',
  USD = 'USD',
    NGN = 'NGN',
    EUR = 'EUR',
    GBP = 'GBP',
    CAD = 'CAD',
    AUD = "AUD", // Australian Dollar
    JPY = "JPY", // Japanese Yen
    CNY = "CNY", // Chinese Yuan
    INR = "INR", // Indian Rupee
    BRL = "BRL", // Brazilian Real
    MXN = "MXN", // Mexican Peso
    RUB = "RUB", // Russian Ruble
    KRW = "KRW", // South Korean Won
    TRY = "TRY", // Turkish Lira
    ARS = "ARS", // Argentine Peso
    CLP = "CLP", // Chilean Peso
    COP = "COP", // Colombian Peso
    PEN = "PEN", // Peruvian Sol
    PHP = "PHP", // Philippine Peso
    MYR = "MYR", // Malaysian Ringgit
    SGD = "SGD", // Singapore Dollar
    IDR = "IDR", // Indonesian Rupiah
    THB = "THB", // Thai Baht
    VND = "VND", // Vietnamese Dong
    AED = "AED", // United Arab Emirates Dirham
    SAR = "SAR", // Saudi Riyal
    QAR = "QAR", // Qatari Riyal
    KWD = "KWD", // Kuwaiti Dinar
    OMR = "OMR", // Omani Rial
    BHD = "BHD", // Bahraini Dinar
    JOD = "JOD", // Jordanian Dinar
    LBP = "LBP", // Lebanese Pound
    ILS = "ILS", // Israeli New Shekel
    PKR = "PKR", // Pakistani Rupee
    BDT = "BDT", // Bangladeshi Taka
    LKR = "LKR", // Sri Lankan Rupee
    MUR = "MUR", // Mauritian Rupee
    TND = "TND", // Tunisian Dinar
    DZD = "DZD", // Algerian Dinar
  ZAR = "ZAR", // South African Rand
  GHS = "GHS", // Ghanaian Cedi
  KES = "KES", // Kenyan Shilling
  UGX = "UGX", // Ugandan Shilling
  TZS = "TZS", // Tanzanian Shilling
  RWF = "RWF", // Rwandan Franc
  ZMW = "ZMW", // Zambian Kwacha
  XOF = "XOF", // West African CFA Franc
  XAF = "XAF", // Central African CFA Franc
  EGP = "EGP", // Egyptian Pound
  MAD = "MAD", // Moroccan Dirham
  ETB = "ETB", // Ethiopian Birr
  MWK = "MWK", // Malawian Kwacha
  SLL = "SLL", // Sierra Leonean Leone
  LRD = "LRD", // Liberian Dollar
  CVE = "CVE", // Cape Verdean Escudo
  GMD = "GMD", // Gambian Dalasi
  GNF = "GNF", // Guinean Franc
  MRU = "MRU", // Mauritanian Ouguiya
  STN = "STN",
}

/**
 * IPrice
 *
 * Represents a pricing tier for an event.
 *  - currency: ISO 4217 currency code from the Currency enum
 *  - amount: Numeric price value in the specified currency
 */
export interface IPrice {
  currency: Currency;
  amount: number;
}

/**
 * IEvent
 *
 * Represents the complete structure of a publishable event.
 *  - name: Event title
 *  - date: Event date (JavaScript Date object)
 *  - time: Event start time as string (e.g. "14:30")
 *  - description: Detailed event description
 *  - bannerUrl: URL to event banner/cover image
 *  - watermarkUrl: URL to watermark/logo image applied during streaming
 *  - createdBy: User ID of the event creator
 *  - published: Boolean flag indicating if event is live/published
 *  - prices: Array of pricing tiers (multiple currencies supported)
 *  - haveBroadcastRoom: Whether a dedicated broadcast room/chat is enabled
 *  - broadcastSoftware: Name of streaming software used (e.g. "OBS", "Streamlabs")
 *  - scheduledTestDate: Date when a test broadcast is scheduled
 *  - eventTrailer: URL to promotional trailer/teaser video
 *  - streamingDeviceType: Whether stream is from mobile or desktop/web
 */
export interface IEvent {
  name: string;
  date: Date;
  time: string;
  description: string;
  bannerUrl: string;
  watermarkUrl: string;
  createdBy: string;
  published: boolean;
  prices: IPrice[];
  haveBroadcastRoom: boolean;
  broadcastSoftware: string;
  scheduledTestDate: Date;
  eventTrailer: string;
  streamingDeviceType: StreamingDeviceType;
}