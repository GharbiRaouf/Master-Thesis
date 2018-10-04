export const standard_canvas = [
    {
        id: 0,
        category: "key-partners",
        isSmart: true,
        width: 3,
        isCompound: false
    },
    {
        isCompound: true,
        id: 1,
        width: 2,
        items: [
            {
                id: 1,
                isSmart: true,
                isCompound: true,
                category: "key-activites",
                width: 12
            },
            {
                id: 2,
                isSmart: false,
                isCompound: true,
                category: "key-resources",
                width: 12
            }
        ]
    },
    {
        id: 3,
        isSmart: true,
        category: "value-propositions",
        width: 2,
        isCompound: false
    },
    {
        isCompound: true,
        id: 4,
        width: 2,
        items: [
            {
                id: 4,
                category: "customer-relationships",
                isSmart: false,
                width: 12,
                isCompound: true
            },
            {
                id: 5,
                category: "channels",
                isSmart: false,
                width: 12,
                isCompound: true
            }
        ]
    },
    {
        id: 6,
        category: "customer-segments",
        isSmart:false,
        width: 3,
        isCompound: false
    },
    {
        id: 7,
        category: "cost-structure",
        isSmart:false,
        width: 6,
        isCompound: false
    },
    {
        id: 8,
        category: "revenue-streams",
        isSmart:false,
        width: 6,
        isCompound: false
    }
];

export const lean_canvas = [
    {
        id: 0,
        isSmart: true,
        category: "problem",
        width: 4,
        isCompound: false
    },
    {
        isCompound: true,
        id: 2,
        width: 4,
        items: [
            {
                id: 1,
                isCompound: true,
                isSmart: true,
                category: "solution",
                width: 12
            },
            {
                id: 2,
                isSmart: false,
                isCompound: true,
                category: "key-activity",
                width: 12
            }
        ]
    },
    {
        id: 3,
        isSmart: true,
        category: "unique-value-propositions",
        width: 4,
        isCompound: false
    },
    {
        id: 7,
        category: "cost-structure",
        width: 9,
        isSmart: false,
        isCompound: false
    },
    {
        id: 8,
        isSmart: false,
        category: "revenue",
        width: 3,
        isCompound: false
    }
];
const canvas_style = {
    standard_canvas,
    lean_canvas
}
export default canvas_style;