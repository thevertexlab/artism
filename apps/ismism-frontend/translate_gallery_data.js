const fs = require('fs');
const path = require('path');

// Read original data file
const dataFilePath = path.join(__dirname, 'src/data/galleryImages.json');
// Backup original file
const backupFilePath = path.join(__dirname, 'src/data/galleryImages_backup.json');

// Art style Chinese-English translation table
const styleTranslations = {
  '印象派': 'Impressionism',
  '后印象派': 'Post-Impressionism',
  '未来主义': 'Futurism',
  '超现实主义': 'Surrealism',
  '现代主义': 'Modernism',
  '极简主义': 'Minimalism',
  '表现主义': 'Expressionism',
  '抽象主义': 'Abstract Art',
  '立体主义': 'Cubism',
  '波普艺术': 'Pop Art',
  '观念艺术': 'Conceptual Art',
  '装置艺术': 'Installation Art',
  '行为艺术': 'Performance Art',
  '街头艺术': 'Street Art',
  '数字艺术': 'Digital Art',
  'NFT艺术': 'NFT Art',
  '视频艺术': 'Video Art',
  '野兽派': 'Fauvism',
  '达达主义': 'Dadaism',
  '构成主义': 'Constructivism',
  '新表现主义': 'Neo-Expressionism',
  '新印象派': 'Neo-Impressionism'
};

// Artist Chinese-English translation table
const artistTranslations = {
  '文森特·梵高': 'Vincent van Gogh',
  '萨尔瓦多·达利': 'Salvador Dalí',
  '乔治亚·欧姬芙': 'Georgia O\'Keeffe',
  '巴勃罗·毕加索': 'Pablo Picasso',
  '克劳德·莫奈': 'Claude Monet',
  '爱德华·蒙克': 'Edvard Munch',
  '瓦西里·康定斯基': 'Wassily Kandinsky',
  '弗里达·卡罗': 'Frida Kahlo',
  '杰克逊·波洛克': 'Jackson Pollock',
  '雅克-路易·大卫': 'Jacques-Louis David',
  '安迪·沃霍尔': 'Andy Warhol',
  '亨利·马蒂斯': 'Henri Matisse',
  '马克·罗斯科': 'Mark Rothko',
  '保罗·塞尚': 'Paul Cézanne',
  '雷内·马格里特': 'René Magritte',
  '奥古斯特·罗丹': 'Auguste Rodin',
  '约翰内斯·维米尔': 'Johannes Vermeer',
  '阿尔布雷特·丢勒': 'Albrecht Dürer',
  '亨利·卢梭': 'Henri Rousseau',
  '马塞尔·杜尚': 'Marcel Duchamp'
};

// Function to convert description text
function translateDescription(description, artist, year, style) {
  // Check if it's already in English
  if (!description.includes('这是一幅')) {
    return description;
  }

  const englishStyle = styleTranslations[style] || style;
  const englishArtist = artistTranslations[artist] || artist;

  return `This is a ${englishStyle.toLowerCase()} work created by ${englishArtist} in ${year}. This artwork showcases the artist's unique perspective and creative style, worthy of careful appreciation.`;
}

try {
  // Read JSON file
  const fileContent = fs.readFileSync(dataFilePath, 'utf8');
  const data = JSON.parse(fileContent);

  // Backup original file
  fs.writeFileSync(backupFilePath, fileContent, 'utf8');
  console.log(`Original file backed up to ${backupFilePath}`);

  // Convert data
  const translatedData = data.map((item, index) => {
    // Get number from original ID (if any)
    const idMatch = item.id.match(/\d+/);
    const idNumber = idMatch ? idMatch[0] : (index + 1);
    
    return {
      id: item.id,
      title: `Artwork ${idNumber}`,
      artist: artistTranslations[item.artist] || item.artist,
      year: item.year,
      imageUrl: item.imageUrl,
      style: styleTranslations[item.style] || item.style,
      description: translateDescription(item.description, item.artist, item.year, item.style)
    };
  });
  
  // Write back to original file
  fs.writeFileSync(dataFilePath, JSON.stringify(translatedData, null, 2), 'utf8');
  console.log(`Translation complete! Original file has been updated.`);

} catch (error) {
  console.error('Error processing the file:', error);
}