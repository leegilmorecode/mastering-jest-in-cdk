type EVProductCategory = 'Vehicle' | 'Battery' | 'Charger' | 'Accessory';

interface EVProductBase {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: EVProductCategory;
  tags?: string[];
  available: boolean;
  releaseDate?: Date;
  created?: string;
  updated?: string;
}

interface VehicleSpecifications {
  range: number; // in kilometers or miles
  batteryCapacity: number; // in kWh
  topSpeed: number; // in km/h or mph
  acceleration: number; // 0-100 km/h or 0-60 mph time
  seatingCapacity: number;
  drivetrain: 'FWD' | 'RWD' | 'AWD'; // Front-Wheel Drive, Rear-Wheel Drive, All-Wheel Drive
}

interface BatterySpecifications {
  capacity: number; // in kWh
  type: 'Lithium-Ion' | 'Solid-State' | 'Other';
  weight: number; // in kilograms
  voltage: number; // in volts
  dimensions: {
    length: number; // in centimeters
    width: number; // in centimeters
    height: number; // in centimeters
  };
}

interface ChargerSpecifications {
  powerOutput: number; // in kW
  type: 'Level 1' | 'Level 2' | 'DC Fast Charger';
  connectorType: 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | 'Tesla';
}

interface AccessorySpecifications {
  compatibility: string[]; // List of compatible vehicles or products
  weight?: number; // in kilograms
  dimensions?: {
    length: number; // in centimeters
    width: number; // in centimeters
    height: number; // in centimeters
  };
}

export type Product =
  | (EVProductBase & {
      category: 'Vehicle';
      specifications: VehicleSpecifications;
    })
  | (EVProductBase & {
      category: 'Battery';
      specifications: BatterySpecifications;
    })
  | (EVProductBase & {
      category: 'Charger';
      specifications: ChargerSpecifications;
    })
  | (EVProductBase & {
      category: 'Accessory';
      specifications: AccessorySpecifications;
    });
