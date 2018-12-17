
export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const switchColumn = (
    startList,
    startIndex,
    endList,
    endIndex,
    newCategory
) => {
    const startResult = Array.from(startList);
    const endResult = Array.from(endList);
    
    const [removed] = startResult.splice(startIndex, 1);
    removed.note_position = newCategory;
    endResult.splice(endIndex, 0, removed);
    return [startResult, endResult];
};

export const getDroppableStyle = isDraggingOver => ({
    background: isDraggingOver ? "darkgrey" : "lightgrey",
    height: "100%",
    minHeight: "100px",
    padding: "10px 0px 10px 0px"
});

export const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // padding: 0,
    // margin: `0 0 0px 0`,
    filter: isDragging ? "blur(1px)" : "none",

    // styles we need to apply on draggables
    ...draggableStyle
});
