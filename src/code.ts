
figma.showUI(__html__, { height: 320 });

const JAPANSE_FONT_NAME_FRAGMENTS = ["Futo Go", "Matisse"]

figma.listAvailableFontsAsync().then(fonts => {
  const japaneseFonts = fonts.filter((font) => {
    let isJapanese = false
    JAPANSE_FONT_NAME_FRAGMENTS.forEach((fragment) => {
      if(font.fontName.family.includes(fragment)) {
        isJapanese = true
      }
    })
    return isJapanese    
  })
  // style が違う同名フォントがあり得るので重複排除
  const uniqueJapaneseFonts = japaneseFonts.filter((font, index) => japaneseFonts.findIndex((_font) => _font.fontName.family === font.fontName.family) === index)
  figma.ui.postMessage(uniqueJapaneseFonts)
})

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