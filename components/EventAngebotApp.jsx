'use client';
import { useState, useEffect } from 'react';
import { Camera, Palette, FileText, PlusCircle, XCircle, ChevronDown, ChevronUp, Save } from 'lucide-react';

// Erweiterte Standardeinstellungen mit mehr Konfigurationsmöglichkeiten
const DEFAULT_ADMIN_SETTINGS = {
  companyName: 'EventCatering GmbH',
  logoText: 'EC',
  footerText: 'EventCatering GmbH | Angebot gültig für 30 Tage',
  defaultContactName: 'Max Mustermann',
  defaultContactEmail: 'kontakt@eventcatering.de',
  defaultContactPhone: '+49 123 4567890',
  defaultPricePerPerson: 35.00,
  // Farbschemas
  colorSchemes: [
    { id: 'blue', name: 'Blau', primary: '#4a6da7', secondary: '#a74a6d', accent: '#6da74a' },
    { id: 'red', name: 'Rot', primary: '#a74a4a', secondary: '#4a6da7', accent: '#6da74a' },
    { id: 'green', name: 'Grün', primary: '#4aa76d', secondary: '#a74a6d', accent: '#6d4aa7' },
    { id: 'purple', name: 'Lila', primary: '#6d4aa7', secondary: '#a76d4a', accent: '#4aa76d' },
    { id: 'orange', name: 'Orange', primary: '#a76d4a', secondary: '#4aa76d', accent: '#4a6da7' },
  ],
  activeColorScheme: 'blue',
  // PDF Templates
  pdfTemplates: [
    { 
      id: 'modern', 
      name: 'Modern', 
      preview: 'https://images.unsplash.com/photo-1568290745879-03f4a0a897a8?auto=format&w=400&h=200&fit=crop',
      style: {
        headerStyle: 'flex justify-between items-start',
        logoStyle: 'border-2 py-2 px-4 rounded font-bold',
        titleStyle: 'text-2xl font-bold',
        subtitleStyle: 'text-lg mt-1',
        sectionTitleStyle: 'text-lg font-semibold mb-2',
        priceBoxStyle: 'mt-6 p-4 rounded-md text-white',
        imageStyle: 'w-full h-48 rounded-md mb-6 bg-center bg-cover',
      }
    },
    { 
      id: 'classic', 
      name: 'Klassisch', 
      preview: 'https://images.unsplash.com/photo-1571867424488-4565932edb41?auto=format&w=400&h=200&fit=crop',
      style: {
        headerStyle: 'text-center mb-8',
        logoStyle: 'text-center text-xl font-serif mb-3',
        titleStyle: 'text-3xl font-serif text-center',
        subtitleStyle: 'text-lg font-serif text-center italic mt-2',
        sectionTitleStyle: 'text-xl font-serif text-center mb-4 border-b pb-2',
        priceBoxStyle: 'mt-8 p-6 border border-gray-300 rounded-lg text-center',
        imageStyle: 'w-full h-64 mb-8 bg-center bg-cover',
      }
    },
    { 
      id: 'elegant', 
      name: 'Elegant', 
      preview: 'https://images.unsplash.com/photo-1603733255069-3409b0e0df67?auto=format&w=400&h=200&fit=crop',
      style: {
        headerStyle: 'flex flex-col items-center mb-10',
        logoStyle: 'mb-4 font-light tracking-widest text-2xl',
        titleStyle: 'font-light tracking-wider text-4xl uppercase',
        subtitleStyle: 'font-light text-gray-600 mt-2',
        sectionTitleStyle: 'font-light tracking-wide uppercase mb-3',
        priceBoxStyle: 'mt-8 p-8 bg-gray-50',
        imageStyle: 'w-full h-56 mb-10 bg-center bg-cover',
      }
    },
    { 
      id: 'minimal', 
      name: 'Minimalistisch', 
      preview: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb8d8?auto=format&w=400&h=200&fit=crop',
      style: {
        headerStyle: 'mb-12',
        logoStyle: 'mb-1 text-sm uppercase tracking-widest',
        titleStyle: 'text-3xl font-normal',
        subtitleStyle: 'text-base font-light mt-1',
        sectionTitleStyle: 'text-sm uppercase tracking-wider font-medium mb-3',
        priceBoxStyle: 'mt-8 py-4 border-t border-b',
        imageStyle: 'w-full h-40 mb-12 bg-center bg-cover grayscale',
      }
    },
  ],
  activePdfTemplate: 'modern',
  // Erweitertes Dienstleistungsmanagement
  additionalServices: [
    { id: 'bar', name: 'Bar-Service', description: 'Bar-Service mit professionellen Barkeepern', price: 500, type: 'flat' },
    { id: 'deco', name: 'Dekoration', description: 'Hochwertige Dekoration passend zum Anlass und Jahreszeit', price: 7, type: 'perPerson' },
    { id: 'equipment', name: 'Equipment-Miete', description: 'Komplettes Equipment inkl. Geschirr, Besteck und Gläser', price: 3, type: 'perPerson' },
    { id: 'staff', name: 'Service-Personal', description: 'Professionelles Service-Personal für Ihre Veranstaltung', price: 35, type: 'perHour' },
    { id: 'music', name: 'Musik & Entertainment', description: 'DJ oder Live-Musik nach Wahl', price: 800, type: 'flat' },
  ],
  // Erweiterte Kategorien
  seasons: ['Frühling', 'Sommer', 'Herbst', 'Winter'],
  menuTypes: ['Buffet', 'Fingerfood', 'BBQ', 'Vegan & Vegetarisch'],
  // Neue Hauptgericht-Optionen pro Menütyp
  menuItems: {
    'Buffet': [
      { 
        id: 'roastbeef', 
        name: 'Roastbeef', 
        price: 8.50, 
        description: 'Zartes Roastbeef mit Kräuterkruste', 
        image: 'https://images.unsplash.com/photo-1565200266756-16d5be02d909?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'salmon', 
        name: 'Lachs', 
        price: 7.00, 
        description: 'Gebeizter Lachs mit Dill-Senf-Sauce',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'goose', 
        name: 'Gans', 
        price: 12.00, 
        description: 'Knusprige Gänsekeule mit Apfelrotkohl',
        image: 'https://images.unsplash.com/photo-1574672281194-db2df791f2d0?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'schnitzel', 
        name: 'Schnitzel', 
        price: 6.50, 
        description: 'Wiener Schnitzel mit Kartoffelsalat',
        image: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'currywurst', 
        name: 'Currywurst', 
        price: 4.50, 
        description: 'Berliner Currywurst mit Pommes',
        image: 'https://images.unsplash.com/photo-1575748525274-100a60c71daf?auto=format&w=120&h=120&fit=crop'
      }
    ],
    'Fingerfood': [
      { 
        id: 'canapees', 
        name: 'Canapées', 
        price: 5.50, 
        description: 'Feine Canapées mit verschiedenen Toppings',
        image: 'https://images.unsplash.com/photo-1541795795328-f073b763494e?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'skewers', 
        name: 'Spießchen', 
        price: 4.50, 
        description: 'Mini-Spieße mit Mozzarella und Tomaten',
        image: 'https://images.unsplash.com/photo-1605728522196-d7de8c90f0ce?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'quiche', 
        name: 'Quiche', 
        price: 3.50, 
        description: 'Mini-Quiches mit Spinat und Feta',
        image: 'https://images.unsplash.com/photo-1623259838743-9f1e884fba59?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'slider', 
        name: 'Burger-Slider', 
        price: 6.00, 
        description: 'Mini-Burger mit Rindfleisch',
        image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'springrolls', 
        name: 'Frühlingsrollen', 
        price: 3.00, 
        description: 'Vegetarische Frühlingsrollen',
        image: 'https://images.unsplash.com/photo-1606307305073-d571c84108d3?auto=format&w=120&h=120&fit=crop'
      }
    ],
    'BBQ': [
      { 
        id: 'steak', 
        name: 'Steak', 
        price: 10.50, 
        description: 'Argentinisches Rumpsteak',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'spareribs', 
        name: 'Spareribs', 
        price: 8.50, 
        description: 'Saftige Spareribs mit BBQ-Sauce',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'chicken', 
        name: 'Hähnchen', 
        price: 6.50, 
        description: 'Gegrillte Hähnchenschenkel',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'burger', 
        name: 'Burger', 
        price: 7.00, 
        description: 'Premium Beef Burger',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'bratwurst', 
        name: 'Bratwurst', 
        price: 4.00, 
        description: 'Feine Thüringer Bratwurst',
        image: 'https://images.unsplash.com/photo-1597733153203-a54d0fbc47de?auto=format&w=120&h=120&fit=crop'
      }
    ],
    'Vegan & Vegetarisch': [
      { 
        id: 'risotto', 
        name: 'Risotto', 
        price: 7.50, 
        description: 'Cremiges Pilzrisotto',
        image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e8fe?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'curry', 
        name: 'Curry', 
        price: 6.50, 
        description: 'Aromatisches Gemüsecurry',
        image: 'https://images.unsplash.com/photo-1604320303478-c6ca0c9f01a5?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'bowl', 
        name: 'Buddha Bowl', 
        price: 8.50, 
        description: 'Bunte Bowl mit Quinoa und Avocado',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'pasta', 
        name: 'Pasta', 
        price: 6.00, 
        description: 'Pasta mit mediterranem Gemüse',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&w=120&h=120&fit=crop'
      },
      { 
        id: 'burger_vegan', 
        name: 'Veganer Burger', 
        price: 7.50, 
        description: 'Burger mit Beyond Meat Patty',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&w=120&h=120&fit=crop'
      }
    ]
  },
  // Templates für verschiedene Menütypen und Jahreszeiten
  templates: {
    'Buffet': {
      'Frühling': {
        text: "Unser Frühlingsbuffet bietet eine frische und bunte Auswahl an saisonalen Spezialitäten. Von knackigen Salaten mit frischen Kräutern bis hin zu leichten und aromatischen Hauptgerichten - perfekt für Ihre Frühlingsveranstaltung.",
        image: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?auto=format&w=800&h=250&fit=crop"
      },
      'Sommer': {
        text: "Genießen Sie unser sommerliches Buffet mit mediterranen Einflüssen, frischen Salaten und leichten Gerichten. Die perfekte Wahl für warme Sommertage und laue Abende unter freiem Himmel.",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&w=800&h=250&fit=crop"
      },
      'Herbst': {
        text: "Unser Herbstbuffet verwöhnt Sie mit warmen Farben und kräftigen Aromen. Saisonale Zutaten wie Kürbis, Pilze und Wurzelgemüse sorgen für ein herbstliches Geschmackserlebnis.",
        image: "https://images.unsplash.com/photo-1536392706976-e486e2ba97af?auto=format&w=800&h=250&fit=crop"
      },
      'Winter': {
        text: "Wärmen Sie sich an unserem Winterbuffet mit herzhaften Eintöpfen, festlichen Braten und wärmenden Gewürzen. Ein kulinarisches Highlight für die kalte Jahreszeit.",
        image: "https://images.unsplash.com/photo-1576280314498-31e7c48bccb4?auto=format&w=800&h=250&fit=crop"
      }
    },
    'Fingerfood': {
      'Frühling': {
        text: "Unsere Frühlings-Fingerfood-Kreationen sind leicht, farbenfroh und perfekt für geselliges Beisammensein. Kleine Häppchen mit frischen Zutaten der Saison, die Ihre Gäste begeistern werden.",
        image: "https://images.unsplash.com/photo-1607618605097-83acfd08eb68?auto=format&w=800&h=250&fit=crop"
      },
      'Sommer': {
        text: "Sommerliche Fingerfood-Variationen, die erfrischen und begeistern. Von Gazpacho-Shots bis zu mediterranen Spießchen - ideal für Sommerfeste und entspannte Networking-Events.",
        image: "https://images.unsplash.com/photo-1626078299034-711cdf882abf?auto=format&w=800&h=250&fit=crop"
      },
      'Herbst': {
        text: "Herbstliche Fingerfood-Kreationen mit Kürbis, Pilzen und anderen saisonalen Highlights. Kleine Köstlichkeiten, die Wärme und Behaglichkeit vermitteln.",
        image: "https://images.unsplash.com/photo-1621972660772-6a0427d5e6fa?auto=format&w=800&h=250&fit=crop"
      },
      'Winter': {
        text: "Festliche Fingerfood-Variationen für die Winterzeit. Kleine, wärmende Häppchen, die für eine gemütliche Atmosphäre sorgen und Ihre Winterveranstaltung kulinarisch abrunden.",
        image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&w=800&h=250&fit=crop"
      }
    },
    'BBQ': {
      'Frühling': {
        text: "Starten Sie die Grillsaison mit unserem Frühlings-BBQ-Angebot! Frische Kräuter, leichte Marinaden und knackiges Gemüse vom Grill - der perfekte Start in die warme Jahreszeit.",
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&w=800&h=250&fit=crop"
      },
      'Sommer': {
        text: "Unser Sommer-BBQ ist der Höhepunkt jeder Outdoor-Veranstaltung. Saftige Steaks, bunte Grillspieße und erfrischende Beilagen sorgen für ein unvergessliches Grillerlebnis unter blauem Himmel.",
        image: "https://images.unsplash.com/photo-1534797258760-1bd2cc95a5bd?auto=format&w=800&h=250&fit=crop"
      },
      'Herbst': {
        text: "Verlängern Sie die Grillsaison mit unserem Herbst-BBQ. Rauchige Aromen, herzhafte Marinaden und saisonales Gemüse vom Grill sorgen für ein warmes und gemütliches Ambiente.",
        image: "https://images.unsplash.com/photo-1642783944285-b33b18ef6c3b?auto=format&w=800&h=250&fit=crop"
      },
      'Winter': {
        text: "Unser Winter-BBQ bringt wärmende Aromen in die kalte Jahreszeit. Genießen Sie saftige Fleischspezialitäten und winterliches Grillgemüse mit raffinierten Gewürzen und Saucen.",
        image: "https://images.unsplash.com/photo-1609525313344-a56b96e9afcf?auto=format&w=800&h=250&fit=crop"
      }
    },
    'Vegan & Vegetarisch': {
      'Frühling': {
        text: "Unser veganes Frühlings-Menü zelebriert die Vielfalt frischer, pflanzlicher Zutaten. Kreative Gerichte voller Farben und Aromen, die nicht nur Veganer überzeugen werden.",
        image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&w=800&h=250&fit=crop"
      },
      'Sommer': {
        text: "Sommerliche vegane Köstlichkeiten, die erfrischen und begeistern. Leichte, nährstoffreiche Gerichte aus saisonalen Zutaten - perfekt für warme Tage und bewussten Genuss.",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&w=800&h=250&fit=crop"
      },
      'Herbst': {
        text: "Unser herbstliches veganes Angebot verwöhnt mit wärmenden Aromen und saisonalen Highlights. Kürbis, Pilze und Hülsenfrüchte in kreativen Kompositionen für bewussten Genuss.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&w=800&h=250&fit=crop"
      },
      'Winter': {
        text: "Vegane Winterküche, die wärmt und sättigt. Reichhaltige pflanzliche Gerichte mit winterlichen Gewürzen und Zutaten, die auch in der kalten Jahreszeit für kulinarische Höhepunkte sorgen.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&w=800&h=250&fit=crop"
      }
    }
  }
};

// Die tatsächliche App-Komponente
export default function EventAngebotApp() {
  // State Management
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminSettings, setAdminSettings] = useState(DEFAULT_ADMIN_SETTINGS);
  const [offerData, setOfferData] = useState({
    eventName: 'Firmen-Event',
    personCount: 50,
    season: 'Sommer',
    menuType: 'Buffet',
    pricePerPerson: DEFAULT_ADMIN_SETTINGS.defaultPricePerPerson,
    selectedServices: [],
    selectedMenuItems: [],
    contactName: DEFAULT_ADMIN_SETTINGS.defaultContactName,
    contactEmail: DEFAULT_ADMIN_SETTINGS.defaultContactEmail,
    contactPhone: DEFAULT_ADMIN_SETTINGS.defaultContactPhone,
    offerDate: formatDate(new Date())
  });

  // Aktualisiere ausgewählte Menü-Items beim Wechsel des Menütyps
  useEffect(() => {
    // Wähle das erste Menü-Item aus, wenn der Menütyp wechselt
    if (adminSettings.menuItems[offerData.menuType] && adminSettings.menuItems[offerData.menuType].length > 0) {
      setOfferData({
        ...offerData,
        selectedMenuItems: [adminSettings.menuItems[offerData.menuType][0].id]
      });
    }
  }, [offerData.menuType]);

  // Formatiere das Datum
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Formatiere den Preis in Euro
  function formatPrice(price) {
    return price.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' €';
  }

  // Berechne den Gesamtpreis
  function calculateTotalPrice() {
    let total = offerData.personCount * offerData.pricePerPerson;
    
    // Addiere Preise für ausgewählte Menü-Items
    offerData.selectedMenuItems.forEach(itemId => {
      const menuType = offerData.menuType;
      const menuItems = adminSettings.menuItems[menuType] || [];
      const selectedItem = menuItems.find(item => item.id === itemId);
      
      if (selectedItem) {
        total += selectedItem.price * offerData.personCount;
      }
    });
    
    // Addiere Preise für zusätzliche Dienstleistungen
    offerData.selectedServices.forEach(serviceId => {
      const service = adminSettings.additionalServices.find(s => s.id === serviceId);
      if (service) {
        if (service.type === 'flat') {
          total += service.price;
        } else if (service.type === 'perPerson') {
          total += service.price * offerData.personCount;
        } else if (service.type === 'perHour') {
          // Standardmäßig 4 Stunden annehmen, kann später anpassbar gemacht werden
          total += service.price * 4;
        }
      }
    });
    
    return total;
  }

  // Hole das aktuelle Farbschema
  function getCurrentColorScheme() {
    return adminSettings.colorSchemes.find(scheme => scheme.id === adminSettings.activeColorScheme) || 
           adminSettings.colorSchemes[0];
  }

  // Generiere die Liste der ausgewählten Menü-Items
  function getSelectedMenuItemsText() {
    if (offerData.selectedMenuItems.length === 0) return null;
    
    const menuType = offerData.menuType;
    const menuItems = adminSettings.menuItems[menuType] || [];
    
    const selectedItems = offerData.selectedMenuItems.map(itemId => {
      return menuItems.find(item => item.id === itemId);
    }).filter(Boolean);
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Ausgewählte Gerichte:</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {selectedItems.map((item, index) => (
            <div key={index} className="flex">
              {item.image && (
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-3">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-700">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Generiere die Liste der zusätzlichen Leistungen
  function getAdditionalServicesText() {
    if (offerData.selectedServices.length === 0) return null;
    
    const selectedServiceDetails = offerData.selectedServices.map(serviceId => {
      return adminSettings.additionalServices.find(s => s.id === serviceId);
    }).filter(Boolean);
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Zusätzliche Leistungen:</h3>
        <ul className="list-disc pl-5 mt-2">
          {selectedServiceDetails.map((service, index) => (
            <li key={index}>{service.description}</li>
          ))}
        </ul>
      </div>
    );
  }

  // Bild-Cropper Komponente (einfache Version für Demo)
  function ImageCropper({ imageUrl, onSave }) {
    const [croppedImage, setCroppedImage] = useState(imageUrl);
    
    return (
      <div className="mb-4">
        <div className="relative w-full h-64 border border-gray-300 rounded-md overflow-hidden mb-2">
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <Camera size={40} className="mx-auto mb-2" />
              <p>Hier würde der Cropper erscheinen</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button 
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
            onClick={() => onSave(croppedImage)}
          >
            Bild speichern
          </button>
        </div>
      </div>
    );
  }

  // Komponente zum Hochladen von Bildern
  function ImageUploader() {
    const [selectedSeasonMenuType, setSelectedSeasonMenuType] = useState({
      season: adminSettings.seasons[0],
      menuType: adminSettings.menuTypes[0]
    });
    const [showCropper, setShowCropper] = useState(false);
    
    const currentTemplate = adminSettings.templates[selectedSeasonMenuType.menuType][selectedSeasonMenuType.season];
    
    const handleImageUpload = (e) => {
      setShowCropper(true);
    };
    
    const saveCroppedImage = (croppedImageUrl) => {
      const updatedTemplates = { ...adminSettings.templates };
      updatedTemplates[selectedSeasonMenuType.menuType][selectedSeasonMenuType.season].image = croppedImageUrl;
      
      setAdminSettings({
        ...adminSettings,
        templates: updatedTemplates
      });
      
      setShowCropper(false);
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Bilder-Manager</h2>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Jahreszeit</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedSeasonMenuType.season}
              onChange={(e) => setSelectedSeasonMenuType({...selectedSeasonMenuType, season: e.target.value})}
            >
              {adminSettings.seasons.map((season) => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Menütyp</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedSeasonMenuType.menuType}
              onChange={(e) => setSelectedSeasonMenuType({...selectedSeasonMenuType, menuType: e.target.value})}
            >
              {adminSettings.menuTypes.map((menuType) => (
                <option key={menuType} value={menuType}>{menuType}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Aktuelles Bild</h3>
          <div className="relative w-full h-48 border border-gray-300 rounded-md overflow-hidden mb-4">
            <img 
              src={currentTemplate.image} 
              alt={`${selectedSeasonMenuType.season} ${selectedSeasonMenuType.menuType}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {showCropper ? (
            <ImageCropper 
              imageUrl={currentTemplate.image} 
              onSave={saveCroppedImage}
            />
          ) : (
            <div className="flex justify-end">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleImageUpload}
              >
                Neues Bild hochladen
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Komponente zum Bearbeiten von Texten
  function TextEditor() {
    const [selectedSeasonMenuType, setSelectedSeasonMenuType] = useState({
      season: adminSettings.seasons[0],
      menuType: adminSettings.menuTypes[0]
    });
    
    const [editedText, setEditedText] = useState('');
    
    useEffect(() => {
      setEditedText(adminSettings.templates[selectedSeasonMenuType.menuType][selectedSeasonMenuType.season].text);
    }, [selectedSeasonMenuType]);
    
    const saveText = () => {
      const updatedTemplates = { ...adminSettings.templates };
      updatedTemplates[selectedSeasonMenuType.menuType][selectedSeasonMenuType.season].text = editedText;
      
      setAdminSettings({
        ...adminSettings,
        templates: updatedTemplates
      });
      
      alert('Text gespeichert!');
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Text-Editor</h2>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Jahreszeit</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedSeasonMenuType.season}
              onChange={(e) => setSelectedSeasonMenuType({...selectedSeasonMenuType, season: e.target.value})}
            >
              {adminSettings.seasons.map((season) => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Menütyp</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedSeasonMenuType.menuType}
              onChange={(e) => setSelectedSeasonMenuType({...selectedSeasonMenuType, menuType: e.target.value})}
            >
              {adminSettings.menuTypes.map((menuType) => (
                <option key={menuType} value={menuType}>{menuType}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium">Beschreibungstext</label>
          <textarea
            className="w-full p-3 border rounded-md min-h-[200px]"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end mt-4">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={saveText}
          >
            Text speichern
          </button>
        </div>
      </div>
    );
  }

  // Komponente zum Bearbeiten von Menü-Items
  function MenuItemsEditor() {
    const [selectedMenuType, setSelectedMenuType] = useState(adminSettings.menuTypes[0]);
    const [menuItems, setMenuItems] = useState([...adminSettings.menuItems[selectedMenuType]]);
    const [editMenuItem, setEditMenuItem] = useState(null);
    const [showImageCropper, setShowImageCropper] = useState(false);
    
    // Update Menü-Items, wenn der Menütyp geändert wird
    useEffect(() => {
      setMenuItems([...adminSettings.menuItems[selectedMenuType]]);
    }, [selectedMenuType, adminSettings.menuItems]);
    
    const saveMenuItems = () => {
      const updatedMenuItems = { ...adminSettings.menuItems };
      updatedMenuItems[selectedMenuType] = [...menuItems];
      
      setAdminSettings({
        ...adminSettings,
        menuItems: updatedMenuItems
      });
      
      alert('Menüoptionen gespeichert!');
    };
    
    const addNewMenuItem = () => {
      const newId = `menuitem_${Date.now()}`;
      const newMenuItem = {
        id: newId,
        name: 'Neues Gericht',
        price: 0,
        description: 'Beschreibung des neuen Gerichts',
        image: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?auto=format&w=120&h=120&fit=crop'
      };
      
      setMenuItems([...menuItems, newMenuItem]);
      setEditMenuItem(newMenuItem);
    };
    
    const updateMenuItem = (updatedItem) => {
      const updatedMenuItems = menuItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      setMenuItems(updatedMenuItems);
      setEditMenuItem(null);
    };
    
    const deleteMenuItem = (itemId) => {
      if (confirm('Dieses Menü-Item wirklich löschen?')) {
        setMenuItems(menuItems.filter(item => item.id !== itemId));
        if (editMenuItem && editMenuItem.id === itemId) {
          setEditMenuItem(null);
        }
      }
    };
    
    const handleImageUpload = (item) => {
      setEditMenuItem(item);
      setShowImageCropper(true);
    };
    
    const saveCroppedImage = (imageUrl) => {
      updateMenuItem({
        ...editMenuItem,
        image: imageUrl
      });
      setShowImageCropper(false);
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Menü-Optionen verwalten</h2>
        
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Menütyp</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={selectedMenuType}
            onChange={(e) => setSelectedMenuType(e.target.value)}
          >
            {adminSettings.menuTypes.map((menuType) => (
              <option key={menuType} value={menuType}>{menuType}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <button 
            className="bg-blue-500 text-white px-3 py-2 rounded-md"
            onClick={addNewMenuItem}
          >
            + Neues Gericht hinzufügen
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {menuItems.map((item) => (
            <div key={item.id} className="border p-3 rounded-md">
              <div className="flex mb-3">
                <div 
                  className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 mr-3 cursor-pointer"
                  onClick={() => handleImageUpload(item)}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <p className="text-sm">
                    <span className="font-medium">{formatPrice(item.price)}</span> pro Person
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <button 
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm mr-2"
                  onClick={() => setEditMenuItem(item)}
                >
                  Bearbeiten
                </button>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                  onClick={() => deleteMenuItem(item.id)}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {editMenuItem && !showImageCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Gericht bearbeiten</h3>
              
              <div className="mb-4 flex justify-center">
                <div 
                  className="w-32 h-32 rounded-md overflow-hidden bg-gray-100 mb-2 cursor-pointer"
                  onClick={() => setShowImageCropper(true)}
                >
                  {editMenuItem.image ? (
                    <img src={editMenuItem.image} alt={editMenuItem.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={editMenuItem.name}
                  onChange={(e) => setEditMenuItem({...editMenuItem, name: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Beschreibung</label>
                <textarea 
                  className="w-full p-2 border rounded-md"
                  value={editMenuItem.description}
                  onChange={(e) => setEditMenuItem({...editMenuItem, description: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Preis pro Person (€)</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded-md"
                  value={editMenuItem.price}
                  onChange={(e) => setEditMenuItem({...editMenuItem, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                  onClick={() => setEditMenuItem(null)}
                >
                  Abbrechen
                </button>
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={() => updateMenuItem(editMenuItem)}
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showImageCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Bild bearbeiten</h3>
              <ImageCropper 
                imageUrl={editMenuItem.image || 'https://images.unsplash.com/photo-1546241072-48010ad2862c?auto=format&w=300&h=300&fit=crop'} 
                onSave={saveCroppedImage}
              />
              <div className="text-center mt-4">
                <button 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2"
                  onClick={() => setShowImageCropper(false)}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={saveMenuItems}
          >
            Alle Änderungen speichern
          </button>
        </div>
      </div>
    );
  }

  // Komponente zum Bearbeiten von Dienstleistungen
  function ServiceEditor() {
    const [services, setServices] = useState([...adminSettings.additionalServices]);
    const [editService, setEditService] = useState(null);
    
    const saveServices = () => {
      setAdminSettings({
        ...adminSettings,
        additionalServices: [...services]
      });
      
      alert('Dienstleistungen gespeichert!');
    };
    
    const addNewService = () => {
      const newId = `service${services.length + 1}`;
      const newService = {
        id: newId,
        name: 'Neue Dienstleistung',
        description: 'Beschreibung der neuen Dienstleistung',
        price: 0,
        type: 'flat'
      };
      
      setServices([...services, newService]);
      setEditService(newService);
    };
    
    const updateService = (updatedService) => {
      const updatedServices = services.map(s => 
        s.id === updatedService.id ? updatedService : s
      );
      setServices(updatedServices);
      setEditService(null);
    };
    
    const deleteService = (serviceId) => {
      if (confirm('Diese Dienstleistung wirklich löschen?')) {
        setServices(services.filter(s => s.id !== serviceId));
        if (editService && editService.id === serviceId) {
          setEditService(null);
        }
      }
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Dienstleistungen verwalten</h2>
        
        <div className="mb-4">
          <button 
            className="bg-blue-500 text-white px-3 py-2 rounded-md"
            onClick={addNewService}
          >
            + Neue Dienstleistung
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {services.map((service) => (
            <div key={service.id} className="border p-3 rounded-md">
              <h3 className="font-semibold">{service.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
              <p className="text-sm">
                <span className="font-medium">{formatPrice(service.price)}</span> 
                {service.type === 'perPerson' ? ' pro Person' : service.type === 'perHour' ? ' pro Stunde' : ' pauschal'}
              </p>
              
              <div className="flex justify-end mt-3">
                <button 
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm mr-2"
                  onClick={() => setEditService(service)}
                >
                  Bearbeiten
                </button>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                  onClick={() => deleteService(service.id)}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {editService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Dienstleistung bearbeiten</h3>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={editService.name}
                  onChange={(e) => setEditService({...editService, name: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Beschreibung</label>
                <textarea 
                  className="w-full p-2 border rounded-md"
                  value={editService.description}
                  onChange={(e) => setEditService({...editService, description: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Preis (€)</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded-md"
                  value={editService.price}
                  onChange={(e) => setEditService({...editService, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Preistyp</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={editService.type}
                  onChange={(e) => setEditService({...editService, type: e.target.value})}
                >
                  <option value="flat">Pauschalbetrag</option>
                  <option value="perPerson">Pro Person</option>
                  <option value="perHour">Pro Stunde</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                  onClick={() => setEditService(null)}
                >
                  Abbrechen
                </button>
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={() => updateService(editService)}
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={saveServices}
          >
            Alle Änderungen speichern
          </button>
        </div>
      </div>
    );
  }

  // Komponente für Farbeinstellungen
  function ColorSettings() {
    const [colorSchemes, setColorSchemes] = useState([...adminSettings.colorSchemes]);
    const [activeScheme, setActiveScheme] = useState(adminSettings.activeColorScheme);
    const [editScheme, setEditScheme] = useState(null);
    
    const saveSettings = () => {
      setAdminSettings({
        ...adminSettings,
        colorSchemes: [...colorSchemes],
        activeColorScheme: activeScheme
      });
      
      alert('Farbeinstellungen gespeichert!');
    };
    
    const addNewColorScheme = () => {
      const newId = `color_${Date.now()}`;
      const newScheme = {
        id: newId,
        name: 'Neues Farbschema',
        primary: '#4a6da7',
        secondary: '#a74a6d',
        accent: '#6da74a'
      };
      
      setColorSchemes([...colorSchemes, newScheme]);
      setEditScheme(newScheme);
    };
    
    const updateColorScheme = (updatedScheme) => {
      const updatedSchemes = colorSchemes.map(scheme => 
        scheme.id === updatedScheme.id ? updatedScheme : scheme
      );
      setColorSchemes(updatedSchemes);
      setEditScheme(null);
    };
    
    const deleteColorScheme = (schemeId) => {
      if (colorSchemes.length <= 1) {
        alert('Es muss mindestens ein Farbschema vorhanden sein.');
        return;
      }
      
      if (confirm('Dieses Farbschema wirklich löschen?')) {
        const updatedSchemes = colorSchemes.filter(scheme => scheme.id !== schemeId);
        setColorSchemes(updatedSchemes);
        
        if (activeScheme === schemeId) {
          setActiveScheme(updatedSchemes[0].id);
        }
        
        if (editScheme && editScheme.id === schemeId) {
          setEditScheme(null);
        }
      }
    };
    
    const ColorSchemePreview = ({ scheme }) => (
      <div className="flex space-x-2 mt-2">
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: scheme.primary }}></div>
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: scheme.secondary }}></div>
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: scheme.accent }}></div>
      </div>
    );
    
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Farbeinstellungen</h2>
        
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Aktives Farbschema</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {colorSchemes.map(scheme => (
              <div 
                key={scheme.id} 
                className={`border p-3 rounded-md cursor-pointer transition-all ${
                  activeScheme === scheme.id ? 'border-2 border-blue-500' : ''
                }`}
                onClick={() => setActiveScheme(scheme.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{scheme.name}</h3>
                  {activeScheme === scheme.id && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Aktiv</div>
                  )}
                </div>
                <ColorSchemePreview scheme={scheme} />
                
                <div className="flex justify-end mt-3">
                  <button 
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm mr-2"
                    onClick={(e) => { e.stopPropagation(); setEditScheme(scheme); }}
                  >
                    Bearbeiten
                  </button>
                  <button 
                    className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                    onClick={(e) => { e.stopPropagation(); deleteColorScheme(scheme.id); }}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
            
            <div 
              className="border-2 border-dashed border-gray-300 p-3 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400"
              onClick={addNewColorScheme}
            >
              <div className="text-center">
                <PlusCircle className="mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Neues Farbschema</p>
              </div>
            </div>
          </div>
        </div>
        
        {editScheme && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Farbschema bearbeiten</h3>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={editScheme.name}
                  onChange={(e) => setEditScheme({...editScheme, name: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Primärfarbe</label>
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-md mr-2" 
                    style={{ backgroundColor: editScheme.primary }}
                  ></div>
                  <input 
                    type="text"
                    className="flex-1 p-2 border rounded-md"
                    value={editScheme.primary}
                    onChange={(e) => setEditScheme({...editScheme, primary: e.target.value})}
                  />
                  <input 
                    type="color"
                    className="w-10 h-10 ml-2"
                    value={editScheme.primary}
                    onChange={(e) => setEditScheme({...editScheme, primary: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Sekundärfarbe</label>
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-md mr-2" 
                    style={{ backgroundColor: editScheme.secondary }}
                  ></div>
                  <input 
                    type="text"
                    className="flex-1 p-2 border rounded-md"
                    value={editScheme.secondary}
                    onChange={(e) => setEditScheme({...editScheme, secondary: e.target.value})}
                  />
                  <input 
                    type="color"
                    className="w-10 h-10 ml-2"
                    value={editScheme.secondary}
                    onChange={(e) => setEditScheme({...editScheme, secondary: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Akzentfarbe</label>
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-md mr-2" 
                    style={{ backgroundColor: editScheme.accent }}
                  ></div>
                  <input 
                    type="text"
                    className="flex-1 p-2 border rounded-md"
                    value={editScheme.accent}
                    onChange={(e) => setEditScheme({...editScheme, accent: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                  onClick={() => setEditScheme(null)}
                >
                  Abbrechen
                </button>
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={() => updateColorScheme(editScheme)}
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={saveSettings}
          >
            Änderungen speichern
          </button>
        </div>
      </div>
    );
  }
  
  // Komponente für Template-Auswahl
  function TemplateSelector() {
    const [templates, setTemplates] = useState([...adminSettings.pdfTemplates]);
    const [activeTemplate, setActiveTemplate] = useState(adminSettings.activePdfTemplate);
    
    const saveSettings = () => {
      setAdminSettings({
        ...adminSettings,
        pdfTemplates: [...templates],
        activePdfTemplate: activeTemplate
      });
      
      alert('Template-Einstellungen gespeichert!');
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">PDF-Template auswählen</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {templates.map(template => (
            <div 
              key={template.id} 
              className={`border p-3 rounded-md cursor-pointer transition-all ${
                activeTemplate === template.id ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTemplate(template.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{template.name}</h3>
                {activeTemplate === template.id && (
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Aktiv</div>
                )}
              </div>
              
              <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={saveSettings}
          >
            Auswahl speichern
          </button>
        </div>
      </div>
    );
  }

  // Komponente für Firmeneinstellungen
  function CompanySettings() {
    const [settings, setSettings] = useState({
      companyName: adminSettings.companyName,
      logoText: adminSettings.logoText,
      footerText: adminSettings.footerText,
      defaultContactName: adminSettings.defaultContactName,
      defaultContactEmail: adminSettings.defaultContactEmail,
      defaultContactPhone: adminSettings.defaultContactPhone,
      defaultPricePerPerson: adminSettings.defaultPricePerPerson
    });
    
    const saveSettings = () => {
      setAdminSettings({
        ...adminSettings,
        ...settings
      });
      
      // Aktualisiere auch die aktuellen Daten im Formular
      setOfferData({
        ...offerData,
        pricePerPerson: settings.defaultPricePerPerson,
        contactName: settings.defaultContactName,
        contactEmail: settings.defaultContactEmail,
        contactPhone: settings.defaultContactPhone
      });
      
      alert('Einstellungen gespeichert!');
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Firmeneinstellungen</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Firmenname</label>
            <input 
              type="text"
              className="w-full p-2 border rounded-md"
              value={settings.companyName}
              onChange={(e) => setSettings({...settings, companyName: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Logo-Text</label>
            <input 
              type="text"
              className="w-full p-2 border rounded-md"
              value={settings.logoText}
              onChange={(e) => setSettings({...settings, logoText: e.target.value})}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Footer-Text</label>
          <input 
            type="text"
            className="w-full p-2 border rounded-md"
            value={settings.footerText}
            onChange={(e) => setSettings({...settings, footerText: e.target.value})}
          />
        </div>
        
        <h3 className="text-lg font-semibold mt-6 mb-3">Standard-Kontaktdaten</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input 
              type="text"
              className="w-full p-2 border rounded-md"
              value={settings.defaultContactName}
              onChange={(e) => setSettings({...settings, defaultContactName: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">E-Mail</label>
            <input 
              type="email"
              className="w-full p-2 border rounded-md"
              value={settings.defaultContactEmail}
              onChange={(e) => setSettings({...settings, defaultContactEmail: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Telefon</label>
            <input 
              type="text"
              className="w-full p-2 border rounded-md"
              value={settings.defaultContactPhone}
              onChange={(e) => setSettings({...settings, defaultContactPhone: e.target.value})}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Standard-Preis pro Person (€)</label>
          <input 
            type="number"
            step="0.01"
            min="0"
            className="w-full p-2 border rounded-md"
            value={settings.defaultPricePerPerson}
            onChange={(e) => setSettings({...settings, defaultPricePerPerson: parseFloat(e.target.value) || 0})}
          />
        </div>
        
        <div className="flex justify-end mt-6">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={saveSettings}
          >
            Einstellungen speichern
          </button>
        </div>
      </div>
    );
  }

  // Angebotsgenerator Komponente (Benutzerbereich)
  function OfferGenerator() {
    const totalPrice = calculateTotalPrice();
    const colorScheme = getCurrentColorScheme();
    
    const handleDownloadPDF = () => {
      // In einer echten App würde hier PDF-Generation stehen
      alert('In einer echten App würde hier das PDF erstellt und heruntergeladen werden');
    };

    // CSS-Variablen für Farbschema
    const colorStyles = {
      '--primary': colorScheme.primary,
      '--secondary': colorScheme.secondary,
      '--accent': colorScheme.accent
    };
    
    // Template-Stil basierend auf dem ausgewählten Template
    // Template-Stil basierend auf dem ausgewählten Template
const activeTemplate = adminSettings.pdfTemplates.find(t => t.id === adminSettings.activePdfTemplate) || 
adminSettings.pdfTemplates[0];
const defaultStyle = {
headerStyle: 'flex justify-between items-start',
logoStyle: 'border-2 py-2 px-4 rounded font-bold',
titleStyle: 'text-2xl font-bold',
subtitleStyle: 'text-lg mt-1',
sectionTitleStyle: 'text-lg font-semibold mb-2',
priceBoxStyle: 'mt-6 p-4 rounded-md text-white',
imageStyle: 'w-full h-48 rounded-md mb-6 bg-center bg-cover',
};
const templateStyle = activeTemplate?.style || defaultStyle;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={colorStyles}>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Angebotsdaten</h2>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Veranstaltungsname</label>
            <input 
              type="text"
              className="w-full p-2 border rounded-md"
              value={offerData.eventName}
              onChange={(e) => setOfferData({...offerData, eventName: e.target.value})}
              placeholder="z.B. Firmen-Event, Hochzeit, Geburtstag"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Anzahl der Personen</label>
            <input 
              type="number"
              min="1"
              className="w-full p-2 border rounded-md"
              value={offerData.personCount}
              onChange={(e) => setOfferData({...offerData, personCount: parseInt(e.target.value) || 1})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Jahreszeit</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={offerData.season}
              onChange={(e) => setOfferData({...offerData, season: e.target.value})}
            >
              {adminSettings.seasons.map((season) => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Menütyp</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={offerData.menuType}
              onChange={(e) => setOfferData({...offerData, menuType: e.target.value})}
            >
              {adminSettings.menuTypes.map((menuType) => (
                <option key={menuType} value={menuType}>{menuType}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Gerichte auswählen</label>
            <div className="mt-2 space-y-2 border p-3 rounded-md bg-gray-50 max-h-48 overflow-y-auto">
              {adminSettings.menuItems[offerData.menuType]?.map((item) => (
                <div key={item.id} className="flex items-start">
                  <input 
                    type="checkbox"
                    id={`menuitem_${item.id}`}
                    className="mt-1 mr-2"
                    checked={offerData.selectedMenuItems.includes(item.id)}
                    onChange={(e) => {
                      const updatedItems = e.target.checked
                        ? [...offerData.selectedMenuItems, item.id]
                        : offerData.selectedMenuItems.filter(id => id !== item.id);
                      setOfferData({...offerData, selectedMenuItems: updatedItems});
                    }}
                  />
                  <label htmlFor={`menuitem_${item.id}`} className="text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-600">
                      {item.description} - {formatPrice(item.price)} pro Person
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Grundpreis pro Person (€)</label>
            <input 
              type="number"
              step="0.01"
              min="0"
              className="w-full p-2 border rounded-md"
              value={offerData.pricePerPerson}
              onChange={(e) => setOfferData({...offerData, pricePerPerson: parseFloat(e.target.value) || 0})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Zusätzliche Leistungen</label>
            <div className="mt-2 space-y-2 border p-3 rounded-md bg-gray-50 max-h-48 overflow-y-auto">
              {adminSettings.additionalServices.map((service) => (
                <div key={service.id} className="flex items-start">
                  <input 
                    type="checkbox"
                    id={`service_${service.id}`}
                    className="mt-1 mr-2"
                    checked={offerData.selectedServices.includes(service.id)}
                    onChange={(e) => {
                      const updatedServices = e.target.checked
                        ? [...offerData.selectedServices, service.id]
                        : offerData.selectedServices.filter(id => id !== service.id);
                      setOfferData({...offerData, selectedServices: updatedServices});
                    }}
                  />
                  <label htmlFor={`service_${service.id}`} className="text-sm">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-xs text-gray-600">
                      {formatPrice(service.price)} {service.type === 'perPerson' ? 'pro Person' : service.type === 'perHour' ? 'pro Stunde (4h)' : 'pauschal'}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">PDF-Template</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {adminSettings.pdfTemplates.map(template => (
                <div 
                  key={template.id}
                  className={`border rounded-md overflow-hidden cursor-pointer ${
                    adminSettings.activePdfTemplate === template.id ? 'border-2 border-blue-500' : ''
                  }`}
                  onClick={() => setAdminSettings({
                    ...adminSettings, 
                    activePdfTemplate: template.id
                  })}
                >
                  <div className="h-20 bg-gray-100">
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-1 text-center text-sm">{template.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Farbschema</label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {adminSettings.colorSchemes.map(scheme => (
                <div 
                  key={scheme.id}
                  className={`border rounded-md overflow-hidden cursor-pointer ${
                    adminSettings.activeColorScheme === scheme.id ? 'border-2 border-blue-500' : ''
                  }`}
                  onClick={() => setAdminSettings({
                    ...adminSettings,
                    activeColorScheme: scheme.id
                  })}
                >
                  <div className="flex h-10">
                    <div className="flex-1" style={{ backgroundColor: scheme.primary }}></div>
                    <div className="flex-1" style={{ backgroundColor: scheme.secondary }}></div>
                    <div className="flex-1" style={{ backgroundColor: scheme.accent }}></div>
                  </div>
                  <div className="p-1 text-center text-xs">{scheme.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Kontaktdaten</h3>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input 
              type="text"
              className="w-full p-2 border rounded-md"
              value={offerData.contactName}
              onChange={(e) => setOfferData({...offerData, contactName: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">E-Mail</label>
            <input 
              type="email"
              className="w-full p-2 border rounded-md"
              value={offerData.contactEmail}
              onChange={(e) => setOfferData({...offerData, contactEmail: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Telefon</label>
            <input 
              type="tel"
              className="w-full p-2 border rounded-md"
              value={offerData.contactPhone}
              onChange={(e) => setOfferData({...offerData, contactPhone: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Angebotsdatum</label>
            <input 
              type="date"
              className="w-full p-2 border rounded-md"
              value={offerData.offerDate}
              onChange={(e) => setOfferData({...offerData, offerDate: e.target.value})}
            />
          </div>
          
          <div className="mt-6">
            <button 
              className="w-full bg-blue-500 text-white font-medium py-3 rounded-md hover:bg-blue-600 transition-colors"
              style={{ backgroundColor: colorScheme.primary }}
              onClick={handleDownloadPDF}
            >
              Als PDF herunterladen
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg relative">
          <div id="preview" className="bg-white p-6 rounded-md shadow">
            <div className={templateStyle.headerStyle}>
              <div>
                <h1 className={templateStyle.titleStyle} style={{ color: colorScheme.primary }}>{offerData.eventName}</h1>
                <h2 className={templateStyle.subtitleStyle} style={{ color: colorScheme.secondary }}>für {offerData.personCount} Personen</h2>
              </div>
              <div className={templateStyle.logoStyle} 
                style={{ 
                  borderColor: colorScheme.primary,
                  color: colorScheme.primary
                }}
              >
                {adminSettings.logoText}
              </div>
            </div>
            
            <div 
              className={templateStyle.imageStyle}
              style={{ backgroundImage: `url(${adminSettings.templates[offerData.menuType][offerData.season].image})` }}
            ></div>
            
            <div className="mb-8">
              <h3 className={templateStyle.sectionTitleStyle} style={{ color: colorScheme.primary }}>Unser Angebot für Sie</h3>
              <p className="mb-4">{adminSettings.templates[offerData.menuType][offerData.season].text}</p>
              
              <p>
                Wir freuen uns, Ihnen dieses exklusive Angebot für Ihre Veranstaltung unterbreiten zu können. 
                Unser erfahrenes Team sorgt für einen reibungslosen Ablauf und kulinarische Höhepunkte, 
                die Ihre Gäste begeistern werden.
              </p>
              
              {getSelectedMenuItemsText()}
              {getAdditionalServicesText()}
              
              <div className={templateStyle.priceBoxStyle} style={{ backgroundColor: colorScheme.primary, color: 'white' }}>
                <p>Ihr Gesamtpreis:</p>
                <div className="text-2xl font-bold my-1">{formatPrice(totalPrice)}</div>
                <p className="text-sm">
                  inkl. MwSt. ({formatPrice(offerData.pricePerPerson)} Grundpreis pro Person)
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className={templateStyle.sectionTitleStyle} style={{ color: colorScheme.primary }}>Kontaktieren Sie uns</h3>
                <p>Für Rückfragen oder zur Buchung stehen wir Ihnen gerne zur Verfügung:</p>
                <p className="mt-2">
                  <strong>{offerData.contactName}</strong><br />
                  E-Mail: {offerData.contactEmail}<br />
                  Telefon: {offerData.contactPhone}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4 text-sm text-gray-500">
              {adminSettings.footerText} | Angebot erstellt am {new Date(offerData.offerDate).toLocaleDateString('de-DE')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin-Bereich Hauptkomponente
  function AdminPanel() {
    const adminTabs = [
      { id: 'company', label: 'Firmeneinstellungen', icon: <Save size={16} />, component: <CompanySettings /> },
      { id: 'colors', label: 'Farbschemas', icon: <Palette size={16} />, component: <ColorSettings /> },
      { id: 'templates', label: 'PDF-Templates', icon: <FileText size={16} />, component: <TemplateSelector /> },
      { id: 'images', label: 'Bilder verwalten', icon: <Camera size={16} />, component: <ImageUploader /> },
      { id: 'texts', label: 'Texte bearbeiten', component: <TextEditor /> },
      { id: 'menu', label: 'Menü-Optionen', component: <MenuItemsEditor /> },
      { id: 'services', label: 'Dienstleistungen', component: <ServiceEditor /> }
    ];
    
    const [activeAdminTab, setActiveAdminTab] = useState('company');
    
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Admin-Bereich</h2>
        
        <div className="mb-6 border-b">
          <div className="flex flex-wrap">
            {adminTabs.map(tab => (
              <button
                key={tab.id}
                className={`py-2 px-4 font-medium text-sm flex items-center ${
                  activeAdminTab === tab.id
                    ? 'text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveAdminTab(tab.id)}
              >
                {tab.icon && <span className="mr-1">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          {adminTabs.find(tab => tab.id === activeAdminTab)?.component}
        </div>
      </div>
    );
  }

  // Die eigentliche Anwendung
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white py-4" style={{ backgroundColor: getCurrentColorScheme().primary }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Event-Angebot Generator</h1>
            <button 
              className={`px-4 py-2 rounded-md ${isAdminMode ? 'bg-orange-500' : 'bg-green-500'}`}
              onClick={() => setIsAdminMode(!isAdminMode)}
            >
              {isAdminMode ? 'Zum Benutzer-Modus' : 'Zum Admin-Bereich'}
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {isAdminMode ? (
          <AdminPanel />
        ) : (
          <OfferGenerator />
        )}
      </main>
      
      <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          Event-Angebot Generator | Entwickelt für maximale Benutzerfreundlichkeit
        </div>
      </footer>
    </div>
  );
}