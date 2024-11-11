// Tailoring Services
const tailoringServices = {
  housut: [
    {
      name: 'Lahkeen lyhennys',
      price: 29,
      additionalOptions: [
        { name: 'Piilo-ommel', price: 6 },
        { name: 'Upslaaki', price: 6 },
        { name: 'Kanttinauha', price: 9 }
      ]
    },
    { name: 'Lahkeiden kavennus', price: 39 },
    { name: 'Vyötärön kavennus/levennys takasaumasta', price: 37 },
    {
      name: 'Vyötärön kavennus/levennys sivusaumoista',
      price: 45,
      note: 'Kavennus tehdään sivusaumoista, kun kavennus on yli 4cm.'
    },
    { name: 'Vetoketjun vaihto', price: 36 },
    { name: 'Paikkaus/korjaus saumasta', price: 22 }
  ],
  farkut: [
    { name: 'Lahkeiden lyhennys', price: 32 },
    { name: 'Lahkeiden kavennus', price: 42 },
    {
      name: 'Vyötärön kavennus takasaumasta',
      price: 42
    },
    {
      name: 'Vyötärön kavennus sivusaumoista',
      price: 65,
      note: 'Kavennus tehdään sivusaumoista, kun kavennus on yli 4cm.'
    },
    { name: 'Vetoketjun vaihto', price: 39 },
    { name: 'Paikkaus/korjaus saumasta', price: 22 }
  ],
  paidat: [
    { name: 'Hihojen lyhennys', price: 29 },
    {
      name: 'Halkiolliset hihat napeilla',
      price: 10,
      additionalTo: 'Hihojen lyhennys'
    },
    { name: 'Helman/vyötäisen kavennus', price: 29 },
    { name: 'Helman lyhennys', price: 29 },
    { name: 'Halkiollinen helma', price: 14, additionalTo: 'Helman lyhennys' },
    { name: 'Villapaidan/neuleen hihojen lyhennys', price: 44 },
    { name: 'Villapaidan/neuleen helman kavennus', price: 49 },
    { name: 'Topin olkainten lyhennys', price: 22 },
    { name: 'Paikkaus/korjaus saumasta', price: 22 }
  ],
  jakut_pikkutakit: [
    { name: 'Hihojen lyhennys', price: 42 },
    { name: 'Vuorillinen hihat', price: 14, additionalTo: 'Hihojen lyhennys' },
    {
      name: 'Halkiolliset hihat napeilla',
      price: 15,
      additionalTo: 'Hihojen lyhennys'
    },
    { name: 'Hihojen pidennys', price: 55 },
    {
      name: 'Vuorillinen pidennys',
      price: 12,
      additionalTo: 'Hihojen pidennys'
    },
    {
      name: 'Hihojen kavennus',
      price: 49,
      additionalOptions: [{ name: 'Vuorillinen', price: 18 }]
    },
    {
      name: 'Helman/vyötäisen kavennus sivusaumoista',
      price: 50,
      additionalOptions: [{ name: 'Vuorillinen', price: 16 }]
    },
    {
      name: 'Helman lyhennys',
      price: 55,
      additionalOptions: [{ name: 'Vuorillinen', price: 14 }]
    },
    {
      name: 'Hartian kavennus',
      price: 74,
      additionalOptions: [{ name: 'Vuorillinen', price: 25 }]
    },
    { name: 'Kavennus/levennys 2 nappia siirtämällä', price: 30 },
    { name: 'Kavennus/levennys 3-6 nappia siirtämällä', price: 45 },
    { name: 'Vuorin vaihtaminen', price: 220 },
    {
      name: 'Paikkaus/korjaus saumasta',
      price: 22,
      additionalOptions: [{ name: 'Vuorillinen', price: 5 }]
    }
  ],
  mekot_hameet: [
    {
      name: 'Helman lyhennys',
      price: 35,
      additionalOptions: [
        { name: 'Vuorillinen', price: 10 },
        { name: 'Halkiollinen helma', price: 15 },
        { name: 'Piilo-ommel', price: 12 }
      ]
    },
    {
      name: 'Hameen kavennus takasaumasta',
      price: 37,
      additionalOptions: [
        { name: 'Vuorillinen', price: 10 },
        { name: 'Vetoketju kyseisessä saumassa', price: 17 }
      ]
    },
    {
      name: 'Hameen kavennus sivusaumoista',
      price: 45,
      additionalOptions: [
        { name: 'Vuorillinen', price: 10 },
        { name: 'Vetoketju kyseisessä saumassa', price: 17 }
      ]
    },
    {
      name: 'Mekon kavennus takasaumasta',
      price: 39,
      additionalOptions: [
        { name: 'Vuorillinen', price: 10 },
        { name: 'Vetoketju kyseisessä saumassa', price: 17 }
      ]
    },
    {
      name: 'Mekon vetoketjun vaihto',
      price: 46,
      additionalOptions: [{ name: 'Metallinen vetoketju', price: 8 }]
    },
    {
      name: 'Hameen vetoketjun vaihto',
      price: 35,
      additionalOptions: [{ name: 'Metallinen vetoketju', price: 8 }]
    },
    { name: 'Mekon olkainten lyhennys', price: 24 },
    {
      name: 'Paikkaus/korjaus saumasta',
      price: 22,
      additionalOptions: [{ name: 'Vuorillinen', price: 5 }]
    }
  ],
  takit: [
    {
      name: 'Hihojen lyhennys',
      price: 45,
      additionalOptions: [
        { name: 'Vuorillinen', price: 14 },
        { name: 'Halkiolliset hihat', price: 15 }
      ]
    },
    {
      name: 'Hihojen lyhennys ja resorin siirto',
      price: 65,
      additionalOptions: [{ name: 'Vuorillinen', price: 14 }]
    },
    {
      name: 'Hihojen lyhennys ja vetoketjun siirto',
      price: 75,
      additionalOptions: [{ name: 'Vuorillinen', price: 14 }]
    },
    {
      name: 'Hihojen kavennus',
      price: 52,
      additionalOptions: [{ name: 'Vuorillinen', price: 14 }]
    },
    {
      name: 'Helman/vyötäisen kavennus',
      price: 58,
      additionalOptions: [{ name: 'Vuorillinen', price: 16 }]
    },
    {
      name: 'Helman lyhennys',
      price: 62,
      additionalOptions: [
        { name: 'Vuorillinen', price: 14 },
        { name: 'Halkiollinen helma', price: 20 },
        { name: 'Vetoketjullinen takki', price: 35 }
      ]
    },
    {
      name: 'Hartian kavennus',
      price: 79,
      additionalOptions: [{ name: 'Vuorillinen', price: 30 }]
    },
    {
      name: 'Kangastakin vetoketjun vaihto',
      price: 53,
      additionalOptions: [
        { name: 'Metallinen vetoketju', price: 8 },
        { name: 'Pituus yli polven', price: 15 }
      ]
    },
    {
      name: 'Toppatakin vetoketjun vaihto',
      price: 65,
      additionalOptions: [
        { name: 'Metallinen vetoketju', price: 8 },
        { name: 'Pituus yli polven', price: 25 }
      ]
    },
    { name: 'Kavennus/levennys 2 nappia siirtämällä', price: 30 },
    { name: 'Kavennus/levennys 3-6 nappia siirtämällä', price: 45 },
    {
      name: 'Vuorin vaihtaminen',
      price: 220,
      additionalOptions: [{ name: 'Pituus yli polven', price: 60 }]
    },
    {
      name: 'Paikkaus/korjaus saumasta',
      price: 24,
      additionalOptions: [{ name: 'Vuorillinen', price: 6 }]
    }
  ],
  urheiluvaatteet: [
    { name: 'Urheilupaidan hihojen lyhennys', price: 29 },
    { name: 'Urheilutopin olkainten lyhennys', price: 22 },
    {
      name: 'Urheilupaidan vetoketjun vaihto',
      price: 42,
      additionalOptions: [{ name: 'Metallinen vetoketju', price: 8 }]
    },
    {
      name: 'Urheiluhousujen lahkeiden lyhennys',
      price: 29,
      additionalOptions: [{ name: 'Vuorillinen', price: 10 }]
    },
    {
      name: 'Urheiluhousujen vyötärön kavennus',
      price: 37,
      additionalOptions: [{ name: 'Vuorillinen', price: 10 }]
    },
    {
      name: 'Urheiluhousujen vetoketjun vaihto',
      price: 36,
      additionalOptions: [{ name: 'Metallinen vetoketju', price: 8 }]
    },
    {
      name: 'Paikkaus/korjaus saumasta',
      price: 22,
      additionalOptions: [{ name: 'Vuorillinen', price: 6 }]
    }
  ],
  muut_ompelimopalvelut: [
    { name: 'Napin ompelu', price: 6 },
    { name: 'Lisänapit', price: 4 }
  ]
};

// Cobbler Services
const cobblerServices = {
  kengat: [
    { name: 'Korkolapun vaihto, alle 1cm', price: 28 },
    { name: 'Korkolapun vaihto, alle 5cm', price: 34 },
    { name: 'Korkolapun vaihto, yli 5cm', price: 39 },
    { name: 'Paksun korkolapun vaihto', price: 45 },
    {
      name: 'Korkojen päällystys + uudet korkolaput',
      price: 86
    },
    { name: 'Koron kiinnitys per kpl', price: 32 },
    {
      name: 'Puolipohjan vaihto',
      price: 44,
      additionalOptions: [{ name: 'Nahkainen puolipohja', price: 8 }]
    },
    { name: 'Puolipohjan vaihto bootsit', price: 46 },
    { name: 'Kärkipalojen vaihto', price: 29 },
    { name: 'Tennareiden uudelleenpohjaus', price: 109 },
    { name: 'Converse-kenkien uudelleenpohjaus', price: 138 },
    { name: 'Dr. Martens pohjan vaihto', price: 109 },
    { name: 'Yhden kengän pohjan liimaus', price: 23 },
    { name: 'Kenkäparin pohjien liimaus', price: 40 },
    { name: 'Pohjavuorin korjaus', price: 29 },
    { name: 'Sivupaikka', price: 37 },
    { name: 'Päällisen paikka', price: 23 },
    { name: 'Matalan kenkäparin vetoketjun vaihto', price: 58 },
    { name: 'Saappaiden vetoketjun vaihto', price: 75 },
    { name: 'Kenkien puhdistus ja hoito', price: 25 }
  ],
  nahkatyot: [
    { name: 'Hihojen lyhennys', price: 65 },
    { name: 'Hihojen lyhennys ja resorin siirto', price: 75 },
    { name: 'Hihojen lyhennys ja vetoketjun siirto', price: 95 },
    { name: 'Nahkatakin kavennus', price: 95 },
    {
      name: 'Vetoketjun vaihto',
      price: 89,
      additionalOptions: [
        { name: 'Metallinen vetoketju', price: 8 },
        { name: 'Pituus yli polven', price: 45 }
      ]
    },
    { name: 'Moottoripyörätakin vetoketjun vaihto', price: 149 },
    {
      name: 'Vuorin vaihtaminen',
      price: 259,
      additionalOptions: [{ name: 'Pituus yli polven', price: 70 }]
    },
    { name: 'Nahkatakin syväpesu', price: 92 },
    { name: 'Nahkahousut lahkeiden lyhennys', price: 39 },
    { name: 'Lahkeiden kavennus', price: 49 },
    { name: 'Vetoketjun vaihto, ohut nahka', price: 49 },
    { name: 'Vetoketjun vaihto, paksu nahka', price: 59 }
  ],
  laukut: [
    {
      name: 'Vetoketjun vaihto, vetoketju alle 30cm',
      price: 50,
      additionalOptions: [{ name: 'Nahkalaukku', price: 15 }]
    },
    {
      name: 'Vetoketjun vaihto, vetoketju yli 30cm',
      price: 79,
      additionalOptions: [{ name: 'Nahkalaukku vuoriton', price: 25 }]
    },
    { name: 'Sisävetoketjun vaihto vuorilliseen laukkuun', price: 29 },
    {
      name: 'Repun vetoketjun vaihto',
      price: 59,
      additionalOptions: [{ name: 'Metallinen vetoketju', price: 8 }]
    },
    { name: 'Nahkahihnan tikkauskorjaus', price: 15 },
    { name: 'Nahkahihnan korjaus paikalla', price: 26 }
  ],
  muut_nahkatyot: [
    { name: 'Napin ompelu', price: 9 },
    { name: 'Repeämän korjaus, repeämä alle 5cm', price: 25 },
    { name: 'Repeämän korjaus, repeämä yli 5cm', price: 35 },
    { name: 'Tikkaukset', price: 22 },
    { name: 'Tahran puhdistus, alle 20cm', price: 25 }
  ]
};

const laundryServices = [
  { name: 'Housut pesu', price: 18 },
  {
    name: 'Hame pesu',
    price: 17,
    additionalOptions: [{ name: 'Pituus yli polven', price: 9 }]
  },
  {
    name: 'Puku pesu',
    price: 38,
    additionalOptions: [{ name: 'Silkkipuku', price: 15 }]
  },
  { name: 'Puku liivillä pesu', price: 46 },
  { name: 'Mekko, mini pesu', price: 32 },
  { name: 'Mekko, midi pesu', price: 39 },
  { name: 'Mekko, maxi pesu', price: 45 },
  { name: 'Iltapuku pesu', price: 68 },
  { name: 'Jakku / pikkutakki pesu', price: 26 },
  { name: 'Solmio / rusetti pesu', price: 10 },
  {
    name: 'Paita pesu',
    price: 10,
    additionalOptions: [{ name: 'Villa/silkkipaita', price: 7 }]
  },
  {
    name: 'Huivi pesu',
    price: 10,
    additionalOptions: [{ name: 'Villahuivi/silkkihuivi', price: 7 }]
  },
  {
    name: 'Kangastakki pesu',
    price: 39,
    additionalOptions: [
      { name: 'Villakangastakki', price: 5 },
      { name: 'Pituus yli polven', price: 10 }
    ]
  },
  { name: 'Toppatakki pesu', price: 27 },
  {
    name: 'Untuvatakki pesu',
    price: 39,
    additionalOptions: [{ name: 'Pituus yli polven', price: 10 }]
  },
  { name: 'Canada Goose –takit pesu', price: 59 }
];

export { tailoringServices, cobblerServices, laundryServices };
