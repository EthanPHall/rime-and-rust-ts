class IdGenerator {
    static usedUpList: number[] = [];

    static generateUniqueId() {
        let id = Math.floor(Math.random() * 1000000);
        while (this.usedUpList.includes(id)) {
            id = Math.floor(Math.random() * 1000000);
        }
        this.usedUpList.push(id);
        return id;
    }
}

export default IdGenerator;