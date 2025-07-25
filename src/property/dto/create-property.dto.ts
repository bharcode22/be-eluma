export class CreatePropertyDto {
    id?: string;
    user_id: string;
    type_id: string;
    property_tittle?: string;
    description?: string;
    number_of_bedrooms?: number;
    number_of_bathrooms?: number;
    maximum_guest?: number;
    minimum_stay?: number;
    price?: number;
    monthly_price?: number;
    yearly_price?: number;

    location?: {
        general_area?: string;
        map_url?: string;
        longitude?: string;
        latitude?: string;
    };

    availability?: {
        available_from?: Date;
        available_to?: Date;
    };

    facilities?: {
        wifi?: Boolean
        washing_machine?: Boolean
        coffee_maker?: Boolean
        celling_fan?: Boolean
        kettle?: Boolean
        air_conditioning?: Boolean
        tv?: Boolean
        game_console?: Boolean
        private_entrance?: Boolean
        microwave?: Boolean
        pool?: Boolean
        beach_access?: Boolean
        drying_machine?: Boolean
        workspace_area?: Boolean
        toaster?: Boolean
        kitchen?: Boolean
        gym?: Boolean
        refrigenerator?: Boolean
        fridge?: Boolean
        security?: Boolean
    };

    images?: {
        imagesUrl?: string;
        imageName?: string,
    }[];

    propertiesOwner?: {
        fullname?: string;
        name?: string;
        phone?: number;
        watsapp?: number;
        email?: string;
    };

    additionalDetails?: {
        [x: string]: any;
        length: any;
        parking_id: string;
        allow_path?: boolean;
        construction_nearby?: boolean;
        cleaning_requency?: string;
        linen_chaneg?: string;
    };
}
