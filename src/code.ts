
figma.showUI(__html__, { height: 320 });

figma.ui.onmessage = msg => {
  if (msg.type === 'set-font') {
    for (const node of figma.currentPage.selection) {
      if (node.type === 'TEXT') {
        loadFont(msg.data, node);
      }
    }

    if (figma.currentPage.selection.length === 0) {
      figma.notify('Please select a text layer');
    }
  }
};

const loadFont = async (font, node) => {
  let fontStyles = ['Regular', 'Book', 'Plain', 'Normal', 'Roman', 'Mono', 'Medium', 'Light', 'Italic', 'Bold', 'Semi Bold', 'Heavy', 'W3', 'W4'];
  for (let index = 0; index < fontStyles.length; index++) {
    try {
      console.log('Trying font with ' + font + ' ' + fontStyles[index]);
      await figma.loadFontAsync({family: font, style: fontStyles[index]})
      node.fontName = { family: font, style: fontStyles[index]};
      index = fontStyles.length;
      console.log('Success!');
    } catch(error) {
      console.log(error + '. Will try with another font style 🤞');
    }
  }
}