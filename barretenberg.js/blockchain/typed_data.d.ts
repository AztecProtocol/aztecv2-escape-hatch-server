export interface TypedData {
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
    types: {
        [key: string]: {
            name: string;
            type: string;
        }[];
    };
    message: any;
}
//# sourceMappingURL=typed_data.d.ts.map