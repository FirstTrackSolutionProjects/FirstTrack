import z from "zod";

const COLUMN_NAME_TO_EXCEL_MAP = Object.freeze({
  CUSTOMER_REF: 'Customer Reference Number',
  PAYMENT_MODE: '*Payment Mode (cod/pre-paid)',
  COD_AMOUNT: 'COD Amount',
  SHIPPING_TYPE: '*Shipping Type (surface/express)',
  CUSTOMER_NAME: '*Customer Name',
  CUSTOMER_EMAIL: '*Customer Email',
  CUSTOMER_PHONE: '*Customer Phone',
  SHIPPING_ADDRESS: '*Shipping Address (Max 100 Char)',
  SHIPPING_ADDRESS_TYPE: '*Shipping Address Type (home/office)',
  SHIPPING_PINCODE: '*Shipping Pincode',
  SHIPPING_CITY: '*Shipping City',
  SHIPPING_STATE: '*Shipping State',
  LENGTH: '*Length (cm)',
  BREADTH: '*Breadth (cm)',
  HEIGHT: '*Height (cm)',
  WEIGHT: '*Weight (kg)',
  ITEM_NAMES: '*Item Name (Comma Separated)',
  ITEM_QUANTITIES: '*Item Quantity (Comma Separated)',
  ITEM_UNIT_PRICES: '*Item Unit Price (Comma Separated)',
  SHIPMENT_VALUE: '*Shipment Value',
  E_WAYBILL: 'E-Waybill (For Shipment Value more than ₹49999)',
})

const EXCEL_TO_DB_COLUMNS = Object.freeze({
  [COLUMN_NAME_TO_EXCEL_MAP.CUSTOMER_REF]: 'customer_reference_number',
  [COLUMN_NAME_TO_EXCEL_MAP.PAYMENT_MODE]: 'pay_method',
  [COLUMN_NAME_TO_EXCEL_MAP.COD_AMOUNT]: 'cod_amount',
  [COLUMN_NAME_TO_EXCEL_MAP.SHIPPING_TYPE]: 'shipping_mode',
  [COLUMN_NAME_TO_EXCEL_MAP.CUSTOMER_NAME]: 'customer_name',
  [COLUMN_NAME_TO_EXCEL_MAP.CUSTOMER_EMAIL]: 'customer_email',
  [COLUMN_NAME_TO_EXCEL_MAP.CUSTOMER_PHONE]: 'customer_mobile',
  [COLUMN_NAME_TO_EXCEL_MAP.SHIPPING_ADDRESS]: 'shipping_address',
  [COLUMN_NAME_TO_EXCEL_MAP.SHIPPING_ADDRESS_TYPE]: 'shipping_address_type',
  [COLUMN_NAME_TO_EXCEL_MAP.SHIPPING_PINCODE]: 'shipping_postcode',
  [COLUMN_NAME_TO_EXCEL_MAP.SHIPPING_CITY]: 'shipping_city',
  [COLUMN_NAME_TO_EXCEL_MAP.SHIPPING_STATE]: 'shipping_state',
  [COLUMN_NAME_TO_EXCEL_MAP.LENGTH]: 'length',
  [COLUMN_NAME_TO_EXCEL_MAP.BREADTH]: 'breadth',
  [COLUMN_NAME_TO_EXCEL_MAP.HEIGHT]: 'height',
  [COLUMN_NAME_TO_EXCEL_MAP.WEIGHT]: 'weight',
  [COLUMN_NAME_TO_EXCEL_MAP.ITEM_NAMES]: 'product_name',
  [COLUMN_NAME_TO_EXCEL_MAP.ITEM_QUANTITIES]: 'product_quantity',
  [COLUMN_NAME_TO_EXCEL_MAP.ITEM_UNIT_PRICES]: 'selling_price',
  [COLUMN_NAME_TO_EXCEL_MAP.SHIPMENT_VALUE]: 'shipment_value',
  [COLUMN_NAME_TO_EXCEL_MAP.E_WAYBILL]: 'ewaybill'
})

const COLUMN_NAME_MAP = COLUMN_NAME_TO_EXCEL_MAP;

const SHIPPING_TYPE_ENUM_DB = {
  "SURFACE": "Surface",
  "EXPRESS": "Express"
}
const SHIPPING_ADDRESS_TYPE_ENUM_DB = {
  "HOME": "home",
  "OFFICE": "office"
}
const PAYMENT_MODE_ENUM_DB = {
  "PREPAID": "Pre-paid",
  "COD": "COD"
}

const excelValidationSchema = z.object({
  [COLUMN_NAME_MAP.CUSTOMER_REF]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Customer Reference Number Column not found in excel';
      }
      if (issue.code === 'invalid_type') {
        return 'Customer Reference Number must be string';
      }
    }
  }).trim().max(30, {
    error: (issue) => {
      if (issue.code === 'too_big') {
        return 'Customer Reference Number must be at most 30 characters';
      }
    }
  }),
  [COLUMN_NAME_MAP.PAYMENT_MODE]: z.preprocess(
    (value) => {
      if (value === undefined || value === null) return undefined;
      if (typeof value !== 'string') return undefined;
      return value.toUpperCase();
    },
    z.enum(Object.keys(PAYMENT_MODE_ENUM_DB), {
      error: (issue) => {
        if (issue.code === 'invalid_value') {
          return `Payment Mode must be ${Object.keys(PAYMENT_MODE_ENUM_DB).join(' or ')}`;
        }
      }
    })
  ).transform((value) => PAYMENT_MODE_ENUM_DB[value]),
  [COLUMN_NAME_MAP.COD_AMOUNT]: z.coerce.number({
    error: (issue) => {
      if (issue.code === 'invalid_type') {
        return 'COD Amount must be a number';
      }
    }
  }).min(0, 'COD Amount can not be negative'),
  [COLUMN_NAME_MAP.SHIPPING_TYPE]: z.preprocess(
    (value) => {
      if (value === undefined || value === null) return undefined;
      if (typeof value !== 'string') return undefined;
      return value.toUpperCase();
    },
    z.enum(Object.keys(SHIPPING_TYPE_ENUM_DB), {
      error: (issue) => {
        if (issue.code === 'invalid_value') {
          return `Shipping Type must be ${Object.keys(SHIPPING_TYPE_ENUM_DB).join(' or ')}`;
        }
      }
    })
  ).transform((value) => SHIPPING_TYPE_ENUM_DB[value]),
  [COLUMN_NAME_MAP.CUSTOMER_NAME]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Customer Name is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Customer Name must be a string';
      }
    }
  }).trim().min(3, 'Customer Name is required')
    .max(100, 'Customer Name must be at most 100 characters'),
  [COLUMN_NAME_MAP.CUSTOMER_EMAIL]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Customer Email is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Customer Email must be a string';
      }
    }
  }).trim()
    .email({
      error: (issue) => {
        if (issue.code === 'invalid_format') {
          return 'Customer Email is invalid';
        }
      }
    }).max(100, 'Customer Email must be at most 100 characters'),
  [COLUMN_NAME_MAP.CUSTOMER_PHONE]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Customer Phone is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Customer Phone must be a string';
      }
    }
  }).trim()
    .regex(/^[6-9]\d{9}$/, {
      error: (issue) => {
        if (issue.code === 'invalid_format') {
          return 'Customer Phone must be a valid Indian phone number starting with 6, 7, 8, or 9';
        }
      }
    }),
  [COLUMN_NAME_MAP.SHIPPING_ADDRESS]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Shipping Address is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Shipping Address must be a string';
      }
    }
  }).trim().min(5, {
    error: (issue) => {
      if (issue.code === 'too_small') {
        return 'Shipping Address must be at least 5 characters';
      }
    }
  }).max(100, {
    error: (issue) => {
      if (issue.code === 'too_big') {
        return 'Shipping Address must be at most 100 characters';
      }
    }
  }),
  [COLUMN_NAME_MAP.SHIPPING_ADDRESS_TYPE]: z.preprocess(
    (value) => {
      if (value === undefined || value === null) return undefined;
      if (typeof value !== 'string') return undefined;
      return value.toUpperCase();
    },
    z.enum(Object.keys(SHIPPING_ADDRESS_TYPE_ENUM_DB), {
      error: (issue) => {
        if (issue.code === 'invalid_value') {
          return `Shipping Address Type must be ${Object.keys(SHIPPING_ADDRESS_TYPE_ENUM_DB).join(' or ')}`;
        }
      }
    })
  ).transform((value) => SHIPPING_ADDRESS_TYPE_ENUM_DB[value]),
  [COLUMN_NAME_MAP.SHIPPING_PINCODE]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Shipping Pincode is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Shipping Pincode must be a string';
      }
    }
  }).trim().regex(/^[1-9][0-9]{5}$/, {
    error: (issue) => {
      if (issue.code === 'invalid_format') {
        return 'Shipping Pincode must be a valid Indian pincode';
      }
    }
  }),
  [COLUMN_NAME_MAP.SHIPPING_CITY]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Shipping City is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Shipping City must be a string';
      }
    }
  }).trim()
    .min(2, {
      error: (issue) => {
        if (issue.code === 'too_small') {
          return 'Shipping City must be at least 2 characters';
        }
      }
    }).max(50, {
      error: (issue) => {
        if (issue.code === 'too_big') {
          return 'Shipping City must be at most 50 characters';
        }
      }
    }),
  [COLUMN_NAME_MAP.SHIPPING_STATE]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Shipping State is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Shipping State must be a string';
      }
    }
  }).trim()
    .min(2, {
      error: (issue) => {
        if (issue.code === 'too_small') {
          return 'Shipping State must be at least 2 characters';
        }
      }
    }).max(50, {
      error: (issue) => {
        if (issue.code === 'too_big') {
          return 'Shipping State must be at most 50 characters';
        }
      }
    }),
  [COLUMN_NAME_MAP.LENGTH]: z.coerce.number({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Length is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Length must be a number';
      }
      return 'Invalid Length'
    }
  }).int({
    error: (issue) => {
      if (issue.code === 'invalid_type') {
        return 'Length must be an integer';
      }
      return 'Invalid Length'
    }
  }).min(1, {
    error: (issue) => {
      if (issue.code === 'too_small') {
        return 'Length must be at least 1';
      }
    }
  }),
  [COLUMN_NAME_MAP.BREADTH]: z.coerce.number({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Breadth is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Breadth must be a number';
      }
      return 'Invalid Breadth'
    }
  }).int({
    error: (issue) => {
      if (issue.code === 'invalid_type') {
        return 'Breadth must be an integer';
      }
      return 'Invalid Breadth'
    }
  }).min(1, {
    error: (issue) => {
      if (issue.code === 'too_small') {
        return 'Breadth must be at least 1';
      }
    }
  }),
  [COLUMN_NAME_MAP.HEIGHT]: z.coerce.number({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Height is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Height must be a number';
      }
      return 'Invalid Height'
    }
  }).int({
    error: (issue) => {
      if (issue.code === 'invalid_type') {
        return 'Height must be an integer';
      }
      return 'Invalid Height'
    }
  }).min(1, {
    error: (issue) => {
      if (issue.code === 'too_small') {
        return 'Height must be at least 1';
      }
    }
  }),
  [COLUMN_NAME_MAP.WEIGHT]: z.coerce.number({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Weight is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Weight must be a number';
      }
      return 'Invalid Weight'
    }
  }).min(0.01, {
    error: (issue) => {
      if (issue.code === 'too_small') {
        return 'Weight must be at least 0.01 Kg';
      }
      return 'Invalid Weight'
    }
  }).multipleOf(0.001, {
    error: (issue) => {
      if (issue.code === 'not_multiple_of') {
        return 'Weight cannot have more than 3 decimals';
      }
      return 'Invalid Weight'
    }
  }),
  [COLUMN_NAME_MAP.ITEM_NAMES]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Item Names are required';
      }
      if (issue.code === 'invalid_type') {
        return 'Item Names must be a string separated by commas';
      }
      return 'Invalid Item Names'
    }
  }).trim().transform((value) =>
    value.split(",").map((v) => v.trim())
  ),
  [COLUMN_NAME_MAP.ITEM_QUANTITIES]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Item Quantities are required';
      }
      if (issue.code === 'invalid_type') {
        return 'Item Quantities must be a number separated by commas';
      }
      return 'Invalid Item Quantities'
    }
  }).trim().transform((value) =>
    value.split(",").map((v) => v.trim())
  ),
  [COLUMN_NAME_MAP.ITEM_UNIT_PRICES]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Item Unit Prices are required';
      }
      if (issue.code === 'invalid_type') {
        return 'Item Unit Prices must be a number separated by commas';
      }
      return 'Invalid Item Unit Prices'
    }
  }).trim().transform((value) =>
    value.split(",").map((v) => v.trim())
  ),
  [COLUMN_NAME_MAP.SHIPMENT_VALUE]: z.coerce.number({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'Shipment Value is required';
      }
      if (issue.code === 'invalid_type') {
        return 'Shipment Value must be a number';
      }
      return 'Invalid Shipment Value'
    }
  }).min(1, {
    error: (issue) => {
      if (issue.code === 'too_small') {
        return 'Shipment Value must be at least 1';
      }
      return 'Invalid Shipment Value'
    }
  }),
  [COLUMN_NAME_MAP.E_WAYBILL]: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
        return 'E-Waybill column is not found in the excel';
      }
      if (issue.code === 'invalid_type') {
        return 'E-Waybill must be a string';
      }
      return 'Invalid E-Waybill'
    }
  }).trim(),
}).superRefine((data, ctx) => {
  const itemNames = data[COLUMN_NAME_MAP.ITEM_NAMES];
  const itemQuantities = data[COLUMN_NAME_MAP.ITEM_QUANTITIES];
  const itemUnitPrices = data[COLUMN_NAME_MAP.ITEM_UNIT_PRICES];
  if (itemNames.length !== itemQuantities.length || itemNames.length !== itemUnitPrices.length) {
    ctx.addIssue({
      code: 'custom',
      message: 'Item Names, Quantities and Prices must have same number of elements'
    })
    return;
  }
  itemNames.forEach((item, index) => {
    if (item === "") {
      ctx.addIssue({
        code: 'custom',
        message: `Item Name at ${index + 1} cannot be empty`,
        path: [COLUMN_NAME_MAP.ITEM_NAMES],
      });
    }
    if (itemQuantities[index] === "") {
      ctx.addIssue({
        code: 'custom',
        message: `Item Quantity at ${index + 1} cannot be empty`,
        path: [COLUMN_NAME_MAP.ITEM_QUANTITIES],
      });
    }
    if (isNaN(Number(itemQuantities[index]))) {
      ctx.addIssue({
        code: 'custom',
        message: `Item Quantity at ${index + 1} must be a number`,
        path: [COLUMN_NAME_MAP.ITEM_QUANTITIES],
      });
    }
    if (Number(itemQuantities[index]) <= 0) {
      ctx.addIssue({
        code: 'custom',
        message: `Item Quantity at ${index + 1} must be greater than 0`,
        path: [COLUMN_NAME_MAP.ITEM_QUANTITIES],
      });
    }
    if (itemUnitPrices[index] === "") {
      ctx.addIssue({
        code: 'custom',
        message: `Item Unit Price at ${index + 1} cannot be empty`,
        path: [COLUMN_NAME_MAP.ITEM_UNIT_PRICES],
      });
    }
    if (isNaN(Number(itemUnitPrices[index]))) {
      ctx.addIssue({
        code: 'custom',
        message: `Item Unit Price at ${index + 1} must be a number`,
        path: [COLUMN_NAME_MAP.ITEM_UNIT_PRICES],
      });
    }
    if (Number(itemUnitPrices[index]) < 1) {
      ctx.addIssue({
        code: 'custom',
        message: `Item Unit Price at ${index + 1} must be 1 or more`,
        path: [COLUMN_NAME_MAP.ITEM_UNIT_PRICES],
      });
    }
  });
}).refine((data) => {
  const CODAmount = data[COLUMN_NAME_MAP.COD_AMOUNT];
  const paymentMode = data[COLUMN_NAME_MAP.PAYMENT_MODE];
  if (paymentMode.toUpperCase() === PAYMENT_MODE_ENUM_DB.COD && CODAmount <= 0) {
    return false;
  }
  return true;
}, { message: 'COD Amount must be greater than 0 for COD' }).refine((data) => {
  const eWayBill = data[COLUMN_NAME_MAP.E_WAYBILL];
  const shipmentValue = data[COLUMN_NAME_MAP.SHIPMENT_VALUE];
  if (shipmentValue >= 50000 && !eWayBill) {
    return false;
  }
  return true;
}, { message: 'E-Waybill is required for shipment value greater than 50000' })
  .transform(data => {
    const ITEMS = [
      ...data[COLUMN_NAME_MAP.ITEM_NAMES].map((name, index) => {
        return {
          product_name: name,
          product_quantity: data[COLUMN_NAME_MAP.ITEM_QUANTITIES][index],
          selling_price: data[COLUMN_NAME_MAP.ITEM_UNIT_PRICES][index],
        }
      })
    ]
    const newData = {
      ...data,
      items: ITEMS,
    }
    return newData
  })

const SAMPLE_DATA = [
  {
    [COLUMN_NAME_MAP.PICKUP_DATE]: '2024-06-20',
    [COLUMN_NAME_MAP.PICKUP_TIME]: '10:00',
    [COLUMN_NAME_MAP.CUSTOMER_REF]: 'CUSTREF1',
    [COLUMN_NAME_MAP.PAYMENT_MODE]: 'cod',
    [COLUMN_NAME_MAP.COD_AMOUNT]: 1500,
    [COLUMN_NAME_MAP.SHIPPING_TYPE]: 'express',
    [COLUMN_NAME_MAP.CUSTOMER_NAME]: 'Anil Kumar',
    [COLUMN_NAME_MAP.CUSTOMER_EMAIL]: 'anil@example.com',
    [COLUMN_NAME_MAP.CUSTOMER_PHONE]: '9876543210',
    [COLUMN_NAME_MAP.SHIPPING_ADDRESS]: '45, Sector 12, Noida',
    [COLUMN_NAME_MAP.SHIPPING_ADDRESS_TYPE]: 'home',
    [COLUMN_NAME_MAP.SHIPPING_PINCODE]: '201301',
    [COLUMN_NAME_MAP.SHIPPING_CITY]: 'Noida',
    [COLUMN_NAME_MAP.SHIPPING_STATE]: 'UP',
    [COLUMN_NAME_MAP.LENGTH]: 15,
    [COLUMN_NAME_MAP.BREADTH]: 10,
    [COLUMN_NAME_MAP.HEIGHT]: 8,
    [COLUMN_NAME_MAP.WEIGHT]: 1.2,
    [COLUMN_NAME_MAP.ITEM_NAMES]: 'Item1, Item2',
    [COLUMN_NAME_MAP.ITEM_QUANTITIES]: '1, 2',
    [COLUMN_NAME_MAP.ITEM_UNIT_PRICES]: '100, 200',
    [COLUMN_NAME_MAP.SHIPMENT_VALUE]: 1500,
    [COLUMN_NAME_MAP.E_WAYBILL]: '',
  },
  {
    [COLUMN_NAME_MAP.PICKUP_DATE]: '2024-06-19',
    [COLUMN_NAME_MAP.PICKUP_TIME]: '14:00',
    [COLUMN_NAME_MAP.CUSTOMER_REF]: 'CUSTREF1',
    [COLUMN_NAME_MAP.PAYMENT_MODE]: 'Prepaid',
    [COLUMN_NAME_MAP.COD_AMOUNT]: 0,
    [COLUMN_NAME_MAP.SHIPPING_TYPE]: 'surface',
    [COLUMN_NAME_MAP.CUSTOMER_NAME]: 'Anil Kumar',
    [COLUMN_NAME_MAP.CUSTOMER_EMAIL]: 'anil@example.com',
    [COLUMN_NAME_MAP.CUSTOMER_PHONE]: '9876543210',
    [COLUMN_NAME_MAP.SHIPPING_ADDRESS]: '45, Sector 12, Noida',
    [COLUMN_NAME_MAP.SHIPPING_ADDRESS_TYPE]: 'home',
    [COLUMN_NAME_MAP.SHIPPING_PINCODE]: '201301',
    [COLUMN_NAME_MAP.SHIPPING_CITY]: 'Noida',
    [COLUMN_NAME_MAP.SHIPPING_STATE]: 'UP',
    [COLUMN_NAME_MAP.LENGTH]: 15,
    [COLUMN_NAME_MAP.BREADTH]: 10,
    [COLUMN_NAME_MAP.HEIGHT]: 8,
    [COLUMN_NAME_MAP.WEIGHT]: 1.2,
    [COLUMN_NAME_MAP.ITEM_NAMES]: 'Item1, Item2',
    [COLUMN_NAME_MAP.ITEM_QUANTITIES]: '1, 2',
    [COLUMN_NAME_MAP.ITEM_UNIT_PRICES]: '100, 200',
    [COLUMN_NAME_MAP.SHIPMENT_VALUE]: 50000,
    [COLUMN_NAME_MAP.E_WAYBILL]: 'ABCDEFGH',
  },
];

export {
  COLUMN_NAME_TO_EXCEL_MAP,
  EXCEL_TO_DB_COLUMNS,
  excelValidationSchema,
  SAMPLE_DATA
}