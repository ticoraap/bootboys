import { createDock } from "./Dock";

describe("Dock", () => {
    it("returns all docks", () => {
        const docksMock = [{ id: 1 }];
        const dock = createDock({
            getAll: jest.fn().mockReturnValue(docksMock),
        });

        const docks = dock.getAll();

        expect(docks).toStrictEqual(docksMock);
    });
});
