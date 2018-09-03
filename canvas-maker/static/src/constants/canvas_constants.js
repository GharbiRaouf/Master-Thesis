const columns = [
    {
      id: 0,
      category: "key-partners",
      width: 2,
      isCompound: false
    },
    {
      isCompound: true,
      items: [
        {
          id: 1,
          isCompound: true,
          category: "key-activites",
          width: 12
        },
        {
          id: 2,
          isCompound: true,
          category: "key-resources",
          width: 12
        }
      ]
    },
    {
      id: 3,
      category: "value-propositions",
      width: 2,
      isCompound: false
    },
    {
      isCompound: true,
      items: [
        {
          id: 4,
          category: "customer-relationships",
          width: 12,
          isCompound: true
        },
        {
          id: 5,
          category: "channels",
          width: 12,
          isCompound: true
        }
      ]
    },
    {
      id: 6,
      category: "customer-segments",
      width: 2,
      isCompound: false
    },
    {
      id: 7,
      category: "cost-structure",
      width: 5,
      isCompound: false
    },
    {
      id: 8,
      category: "revenue-streams",
      width: 5,
      isCompound: false
    }
  ];
  export default columns;
  