"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollupProofData = exports.InnerProofData = void 0;
const crypto_1 = require("crypto");
const serialize_1 = require("../serialize");
const viewing_key_1 = require("../viewing_key");
class InnerProofData {
    constructor(proofId, publicInput, publicOutput, assetId, newNote1, newNote2, nullifier1, nullifier2, inputOwner, outputOwner) {
        this.proofId = proofId;
        this.publicInput = publicInput;
        this.publicOutput = publicOutput;
        this.assetId = assetId;
        this.newNote1 = newNote1;
        this.newNote2 = newNote2;
        this.nullifier1 = nullifier1;
        this.nullifier2 = nullifier2;
        this.inputOwner = inputOwner;
        this.outputOwner = outputOwner;
        this.txId = crypto_1.createHash('sha256').update(this.toBuffer()).digest();
    }
    getDepositSigningData() {
        return this.toBuffer();
    }
    toBuffer() {
        return Buffer.concat([
            serialize_1.numToUInt32BE(this.proofId, 32),
            this.publicInput,
            this.publicOutput,
            this.assetId,
            this.newNote1,
            this.newNote2,
            this.nullifier1,
            this.nullifier2,
            this.inputOwner,
            this.outputOwner,
        ]);
    }
    isPadding() {
        return this.nullifier1.equals(Buffer.alloc(32, 0));
    }
    static fromBuffer(innerPublicInputs) {
        const proofId = innerPublicInputs.readUInt32BE(0 * 32 + 28);
        const publicInput = innerPublicInputs.slice(1 * 32, 1 * 32 + 32);
        const publicOutput = innerPublicInputs.slice(2 * 32, 2 * 32 + 32);
        const assetId = innerPublicInputs.slice(3 * 32, 3 * 32 + 32);
        const newNote1 = innerPublicInputs.slice(4 * 32, 4 * 32 + 64);
        const newNote2 = innerPublicInputs.slice(6 * 32, 6 * 32 + 64);
        const nullifier1 = innerPublicInputs.slice(8 * 32, 8 * 32 + 32);
        const nullifier2 = innerPublicInputs.slice(9 * 32, 9 * 32 + 32);
        const inputOwner = innerPublicInputs.slice(10 * 32, 10 * 32 + 32);
        const outputOwner = innerPublicInputs.slice(11 * 32, 11 * 32 + 32);
        return new InnerProofData(proofId, publicInput, publicOutput, assetId, newNote1, newNote2, nullifier1, nullifier2, inputOwner, outputOwner);
    }
}
exports.InnerProofData = InnerProofData;
InnerProofData.NUM_PUBLIC_INPUTS = 12;
InnerProofData.LENGTH = InnerProofData.NUM_PUBLIC_INPUTS * 32;
class RollupProofData {
    constructor(rollupId, rollupSize, dataStartIndex, oldDataRoot, newDataRoot, oldNullRoot, newNullRoot, oldDataRootsRoot, newDataRootsRoot, totalTxFees, numTxs, innerProofData, recursiveProofOutput, viewingKeys) {
        this.rollupId = rollupId;
        this.rollupSize = rollupSize;
        this.dataStartIndex = dataStartIndex;
        this.oldDataRoot = oldDataRoot;
        this.newDataRoot = newDataRoot;
        this.oldNullRoot = oldNullRoot;
        this.newNullRoot = newNullRoot;
        this.oldDataRootsRoot = oldDataRootsRoot;
        this.newDataRootsRoot = newDataRootsRoot;
        this.totalTxFees = totalTxFees;
        this.numTxs = numTxs;
        this.innerProofData = innerProofData;
        this.recursiveProofOutput = recursiveProofOutput;
        this.viewingKeys = viewingKeys;
        const allTxIds = this.innerProofData.map(innerProof => innerProof.txId);
        this.rollupHash = crypto_1.createHash('sha256').update(Buffer.concat(allTxIds)).digest();
        if (totalTxFees.length !== RollupProofData.NUMBER_OF_ASSETS) {
            throw new Error(`Expect totalTxFees to be an array of size ${RollupProofData.NUMBER_OF_ASSETS}.`);
        }
    }
    toBuffer() {
        return Buffer.concat([
            serialize_1.numToUInt32BE(this.rollupId, 32),
            serialize_1.numToUInt32BE(this.rollupSize, 32),
            serialize_1.numToUInt32BE(this.dataStartIndex, 32),
            this.oldDataRoot,
            this.newDataRoot,
            this.oldNullRoot,
            this.newNullRoot,
            this.oldDataRootsRoot,
            this.newDataRootsRoot,
            ...this.totalTxFees,
            serialize_1.numToUInt32BE(this.numTxs, 32),
            ...this.innerProofData.map(p => p.toBuffer()),
            this.recursiveProofOutput,
        ]);
    }
    getViewingKeyData() {
        return Buffer.concat(this.viewingKeys.flat().map(vk => vk.toBuffer()));
    }
    static getRollupIdFromBuffer(proofData) {
        return proofData.readUInt32BE(28);
    }
    static getRollupSizeFromBuffer(proofData) {
        return proofData.readUInt32BE(32 + 28);
    }
    static fromBuffer(proofData, viewingKeyData) {
        const rollupId = RollupProofData.getRollupIdFromBuffer(proofData);
        const rollupSize = proofData.readUInt32BE(1 * 32 + 28);
        const dataStartIndex = proofData.readUInt32BE(2 * 32 + 28);
        const oldDataRoot = proofData.slice(3 * 32, 3 * 32 + 32);
        const newDataRoot = proofData.slice(4 * 32, 4 * 32 + 32);
        const oldNullRoot = proofData.slice(5 * 32, 5 * 32 + 32);
        const newNullRoot = proofData.slice(6 * 32, 6 * 32 + 32);
        const oldDataRootsRoot = proofData.slice(7 * 32, 7 * 32 + 32);
        const newDataRootsRoot = proofData.slice(8 * 32, 8 * 32 + 32);
        const totalTxFees = [];
        for (let i = 0; i < RollupProofData.NUMBER_OF_ASSETS; ++i) {
            totalTxFees.push(proofData.slice((9 + i) * 32, (9 + i) * 32 + 32));
        }
        const numTxs = proofData.readUInt32BE((9 + RollupProofData.NUMBER_OF_ASSETS) * 32 + 28);
        const innerProofSize = Math.max(rollupSize, 1); // Escape hatch is demarked 0, but has size 1.
        const innerProofData = [];
        for (let i = 0; i < innerProofSize; ++i) {
            const startIndex = RollupProofData.LENGTH_ROLLUP_PUBLIC + i * InnerProofData.LENGTH;
            const innerData = proofData.slice(startIndex, startIndex + InnerProofData.LENGTH);
            innerProofData[i] = InnerProofData.fromBuffer(innerData);
        }
        // Populate j/s tx viewingKey data.
        const viewingKeys = [];
        if (viewingKeyData) {
            for (let i = 0, jsCount = 0; i < innerProofSize; ++i) {
                if (innerProofData[i].proofId === 0 && !innerProofData[i].isPadding()) {
                    const offset = jsCount * viewing_key_1.ViewingKey.SIZE * 2;
                    const vk1 = new viewing_key_1.ViewingKey(viewingKeyData.slice(offset, offset + viewing_key_1.ViewingKey.SIZE));
                    const vk2 = new viewing_key_1.ViewingKey(viewingKeyData.slice(offset + viewing_key_1.ViewingKey.SIZE, offset + viewing_key_1.ViewingKey.SIZE * 2));
                    jsCount++;
                    viewingKeys.push([vk1, vk2]);
                }
                else {
                    viewingKeys.push([viewing_key_1.ViewingKey.EMPTY, viewing_key_1.ViewingKey.EMPTY]);
                }
            }
        }
        const recursiveStartIndex = RollupProofData.LENGTH_ROLLUP_PUBLIC + innerProofSize * InnerProofData.LENGTH;
        const recursiveProofOutput = proofData.slice(recursiveStartIndex, recursiveStartIndex + 16 * 32);
        return new RollupProofData(rollupId, rollupSize, dataStartIndex, oldDataRoot, newDataRoot, oldNullRoot, newNullRoot, oldDataRootsRoot, newDataRootsRoot, totalTxFees, numTxs, innerProofData, recursiveProofOutput, viewingKeys);
    }
}
exports.RollupProofData = RollupProofData;
RollupProofData.NUMBER_OF_ASSETS = 4;
RollupProofData.NUM_ROLLUP_PUBLIC_INPUTS = 14;
RollupProofData.LENGTH_ROLLUP_PUBLIC = RollupProofData.NUM_ROLLUP_PUBLIC_INPUTS * 32;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm9sbHVwX3Byb29mL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFvQztBQUNwQyw0Q0FBNkM7QUFDN0MsZ0RBQTRDO0FBRTVDLE1BQWEsY0FBYztJQU16QixZQUNTLE9BQWUsRUFDZixXQUFtQixFQUNuQixZQUFvQixFQUNwQixPQUFlLEVBQ2YsUUFBZ0IsRUFDaEIsUUFBZ0IsRUFDaEIsVUFBa0IsRUFDbEIsVUFBa0IsRUFDbEIsVUFBa0IsRUFDbEIsV0FBbUI7UUFUbkIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ25CLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3BCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFFMUIsSUFBSSxDQUFDLElBQUksR0FBRyxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNwRSxDQUFDO0lBRUQscUJBQXFCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ25CLHlCQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLFdBQVc7WUFDaEIsSUFBSSxDQUFDLFlBQVk7WUFDakIsSUFBSSxDQUFDLE9BQU87WUFDWixJQUFJLENBQUMsUUFB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