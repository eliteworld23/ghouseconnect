// src/components/TypeLocationSection.jsx

const TYPES    = ["Apartment","House","Land","Office","Commercial"].map(v => ({ value: v.toLowerCase(), label: v }));
const PURPOSES = ["Sale","Rent","Short Let"].map(v => ({ value: v.toLowerCase().replace(" ","_"), label: v }));
const LABELS   = ["Featured","Hot","New"].map(v => ({ value: v.toLowerCase(), label: v }));

const LOCATIONS = {
  "Abia":        { "Umuahia": ["Umuahia North","Umuahia South","Ikwuano"], "Aba": ["Aba North","Aba South","Osisioma"], "Ohafia": ["Ohafia","Arochukwu"], "Bende": ["Bende","Isuikwuato"] },
  "Adamawa":     { "Yola": ["Yola North","Yola South","Girei"], "Mubi": ["Mubi North","Mubi South","Maiha"], "Numan": ["Numan","Demsa","Lamurde"], "Ganye": ["Ganye","Toungo","Jada"] },
  "Akwa Ibom":   { "Uyo": ["Uyo","Uruan","Ibesikpo Asutan"], "Eket": ["Eket","Esit Eket","Ibeno"], "Ikot Ekpene": ["Ikot Ekpene","Essien Udim","Obot Akara"], "Oron": ["Oron","Mbo","Udung Uko"] },
  "Anambra":     { "Awka": ["Awka North","Awka South","Anaocha"], "Onitsha": ["Onitsha North","Onitsha South","Ogbaru"], "Nnewi": ["Nnewi North","Nnewi South","Ekwusigo"], "Ekwulobia": ["Aguata","Orumba North","Orumba South"] },
  "Bauchi":      { "Bauchi": ["Bauchi","Tafawa Balewa","Dass"], "Azare": ["Katagum","Itas/Gadau","Zaki"], "Misau": ["Misau","Ganjuwa"], "Alkaleri": ["Alkaleri","Kirfi"] },
  "Bayelsa":     { "Yenagoa": ["Yenagoa","Kolokuma/Opokuma","Ogbia"], "Nembe": ["Nembe","Brass","Southern Ijaw"], "Sagbama": ["Sagbama","Ekeremor"] },
  "Benue":       { "Makurdi": ["Makurdi","Guma","Gwer West"], "Gboko": ["Gboko","Tarka"], "Otukpo": ["Otukpo","Obi","Ado"], "Katsina-Ala": ["Katsina-Ala","Ukum","Logo"] },
  "Borno":       { "Maiduguri": ["Maiduguri","Jere","Konduga"], "Biu": ["Biu","Hawul","Kwaya Kusar"], "Gwoza": ["Gwoza","Chibok"], "Dikwa": ["Dikwa","Nganzai"] },
  "Cross River": { "Calabar": ["Calabar Municipality","Calabar South","Akpabuyo"], "Ogoja": ["Ogoja","Yala","Obanliku"], "Ikom": ["Ikom","Boki","Etung"], "Obudu": ["Obudu","Obanliku"] },
  "Delta":       { "Asaba": ["Asaba","Oshimili North","Oshimili South"], "Warri": ["Warri North","Warri South","Effurun"], "Sapele": ["Sapele","Okpe"], "Ughelli": ["Ughelli North","Ughelli South"], "Agbor": ["Ika North East","Ika South"] },
  "Ebonyi":      { "Abakaliki": ["Abakaliki","Izzi","Ohaukwu"], "Afikpo": ["Afikpo North","Afikpo South"], "Onueke": ["Ezza North","Ezza South"], "Ishiagu": ["Ivo","Ohaozara"] },
  "Edo":         { "Benin City": ["Oredo","Ikpoba-Okha","Egor","Ovia North East"], "Ekpoma": ["Esan West","Esan Central"], "Auchi": ["Etsako West","Etsako Central","Etsako East"], "Uromi": ["Esan North East"] },
  "Ekiti":       { "Ado-Ekiti": ["Ado Ekiti","Efon","Ekiti East"], "Ikere": ["Ikere","Ise/Orun"], "Ijero": ["Ijero","Ekiti West"], "Emure": ["Emure","Gbonyin"] },
  "Enugu":       { "Enugu": ["Enugu North","Enugu South","Enugu East"], "Nsukka": ["Nsukka","Igbo-Eze North","Uzo-Uwani"], "Agbani": ["Nkanu West","Nkanu East"], "Awgu": ["Awgu","Aninri"], "Oji River": ["Oji River","Ezeagu"] },
  "FCT (Abuja)": { "Abuja": ["Maitama","Asokoro","Garki","Wuse","Wuse 2","Gwarinpa","Kubwa","Jabi","Utako","Gudu","Central Business District","Life Camp","Lugbe"], "Gwagwalada": ["Gwagwalada","Dobi","Ikwa"], "Kuje": ["Kuje","Chibiri","Rubochi"], "Bwari": ["Bwari","Usuma"], "Abaji": ["Abaji","Rimba"] },
  "Gombe":       { "Gombe": ["Gombe","Kwami","Funakaye"], "Kaltungo": ["Kaltungo","Shongom"], "Billiri": ["Billiri","Balanga"], "Dukku": ["Dukku","Nafada"] },
  "Imo":         { "Owerri": ["Owerri Municipal","Owerri North","Owerri West"], "Orlu": ["Orlu","Orsu","Oru East"], "Okigwe": ["Okigwe","Ihitte/Uboma","Onuimo"], "Oguta": ["Oguta","Ohaji/Egbema"] },
  "Jigawa":      { "Dutse": ["Dutse","Gagarawa","Guri"], "Hadejia": ["Hadejia","Kirikasamma","Kafin Hausa"], "Gumel": ["Gumel","Sule Tankarkar"], "Kazaure": ["Kazaure","Roni","Yankwashi"] },
  "Kaduna":      { "Kaduna": ["Kaduna North","Kaduna South","Chikun"], "Zaria": ["Zaria","Sabon Gari","Soba"], "Kafanchan": ["Jema'a","Kaura","Kauru"], "Kagoro": ["Kaura","Zangon Kataf"] },
  "Kano":        { "Kano": ["Fagge","Dala","Gwale","Kano Municipal","Nassarawa","Tarauni","Ungogo","Kumbotso"], "Wudil": ["Wudil","Garko","Rimin Gado"], "Gaya": ["Gaya","Ajingi","Albasu"], "Bichi": ["Bichi","Tofa","Rogo"] },
  "Katsina":     { "Katsina": ["Katsina","Jibia","Batagarawa"], "Daura": ["Daura","Sandamu","Zango"], "Funtua": ["Funtua","Bakori","Danja"], "Malumfashi": ["Malumfashi","Kafur","Kusada"] },
  "Kebbi":       { "Birnin Kebbi": ["Birnin Kebbi","Gwandu","Aliero"], "Argungu": ["Argungu","Augie","Bagudo"], "Yauri": ["Yauri","Ngaski","Shanga"], "Zuru": ["Zuru","Fakai","Danko/Wasagu"] },
  "Kogi":        { "Lokoja": ["Lokoja","Kogi","Igalamela-Odolu"], "Kabba": ["Kabba/Bunu","Ijumu","Yagba West"], "Okene": ["Okene","Okehi","Adavi"], "Idah": ["Idah","Ibaji","Ofu"] },
  "Kwara":       { "Ilorin": ["Ilorin West","Ilorin East","Ilorin South"], "Offa": ["Offa","Oyun","Ifelodun"], "Omu-Aran": ["Irepodun","Ekiti (Kwara)"], "Lafiagi": ["Edu","Kaiama"] },
  "Lagos":       { "Ikeja": ["Allen Avenue","Alausa","Oregun","Maryland","Opebi","Airport Road","Ojodu","Agidingbi"], "Lagos Island": ["Lagos Island","Ikoyi","Onikan","Obalende","Marina","Epetedo"], "Lekki": ["Lekki Phase 1","Lekki Phase 2","Chevron","Osapa","Agungi","Idado","Sangotedo","Ajah","Abraham Adesanya"], "Surulere": ["Aguda","Ojuelegba","Itire","Iponri","Bode Thomas","Adelabu"], "Yaba": ["Sabo","Abule-Ijesha","Jibowu","Onike","Alagomeji","Iwaya"], "Ikorodu": ["Ikorodu Central","Ijede","Imota","Igbogbo","Isiu","Bayeku"], "Apapa": ["Apapa Central","Ajegunle","Creek Road","Amukoko"], "Victoria Island": ["Adeola Odeku","Ahmadu Bello Way","Kofo Abayomi","Ozumba Mbadiwe","Ligali Ayorinde"], "Festac": ["Festac Town","Amuwo Odofin","Satellite Town","Mile 2"], "Gbagada": ["Gbagada Phase 1","Gbagada Phase 2","Ifako","Bariga"], "Magodo": ["Magodo Phase 1","Magodo Phase 2","Shangisha"], "Isolo": ["Isolo","Ago Palace","Okota","Egbe"] },
  "Nasarawa":    { "Lafia": ["Lafia","Obi","Nassarawa Egon"], "Keffi": ["Keffi","Kokona","Karu"], "Akwanga": ["Akwanga","Wamba","Nasarawa"], "Doma": ["Doma","Awe","Keana"] },
  "Niger":       { "Minna": ["Minna","Bosso","Chanchaga"], "Bida": ["Bida","Agaie","Lapai"], "Kontagora": ["Kontagora","Mariga","Magama"], "Suleja": ["Suleja","Tafa","Gurara"] },
  "Ogun":        { "Abeokuta": ["Abeokuta North","Abeokuta South","Obafemi Owode"], "Sagamu": ["Sagamu","Remo North","Ikenne"], "Ijebu-Ode": ["Ijebu East","Ijebu North","Ijebu Ode"], "Ota": ["Ado-Odo/Ota","Yewa South","Yewa North"], "Ilaro": ["Yewa South","Imeko Afon"] },
  "Ondo":        { "Akure": ["Akure North","Akure South","Ifedore"], "Ondo": ["Ondo West","Ondo East"], "Ore": ["Odigbo","Ile Oluji/Okeigbo"], "Ikare": ["Akoko North East","Akoko North West"], "Okitipupa": ["Okitipupa","Irele","Odigbo"] },
  "Osun":        { "Osogbo": ["Osogbo","Egbedore","Olorunda"], "Ile-Ife": ["Ife Central","Ife East","Ife North","Ife South"], "Ede": ["Ede North","Ede South","Ejigbo"], "Ilesa": ["Ilesa East","Ilesa West","Oriade"], "Iwo": ["Iwo","Boripe","Ola-Oluwa"] },
  "Oyo":         { "Ibadan": ["Ibadan North","Ibadan North East","Ibadan North West","Ibadan South East","Ibadan South West","Bodija","Jericho","Ring Road","Dugbe","Oluyole","Agodi","Challenge"], "Ogbomoso": ["Ogbomoso North","Ogbomoso South","Surulere (Oyo)"], "Oyo": ["Oyo East","Oyo West","Atiba"], "Iseyin": ["Iseyin","Itesiwaju","Kajola"], "Saki": ["Saki East","Saki West","Atisbo"] },
  "Plateau":     { "Jos": ["Jos North","Jos South","Jos East"], "Bukuru": ["Jos South","Barkin Ladi"], "Shendam": ["Shendam","Qua'an Pan","Mikang"], "Pankshin": ["Pankshin","Kanke","Kanam"] },
  "Rivers":      { "Port Harcourt": ["GRA Phase 1","GRA Phase 2","GRA Phase 3","Rumuola","Rumuokoro","Diobu","Trans-Amadi","Woji","Eliozu","D-Line","Peter Odili","Borokiri"], "Obio-Akpor": ["Rumuigbo","Rumuibekwe","Ozuoba","Rumuepirikon","Alakahia"], "Bonny": ["Bonny","Degema","Asari-Toru"], "Eleme": ["Eleme","Tai","Ogu/Bolo"], "Ahoada": ["Ahoada East","Ahoada West","Ogba/Egbema/Ndoni"] },
  "Sokoto":      { "Sokoto": ["Sokoto North","Sokoto South","Wamako"], "Wurno": ["Wurno","Rabah","Bodinga"], "Gwadabawa": ["Gwadabawa","Illela","Isa"], "Argungu": ["Argungu (Sokoto)","Kebbe","Shagari"] },
  "Taraba":      { "Jalingo": ["Jalingo","Yorro","Zing"], "Wukari": ["Wukari","Ibi","Donga"], "Bali": ["Bali","Gashaka","Sardauna"], "Takum": ["Takum","Ussa","Kurmi"] },
  "Yobe":        { "Damaturu": ["Damaturu","Gujba","Gulani"], "Potiskum": ["Potiskum","Nangere","Fune"], "Nguru": ["Nguru","Machina","Yusufari"], "Gashua": ["Bade","Jakusko"] },
  "Zamfara":     { "Gusau": ["Gusau","Bungudu","Maru"], "Kaura Namoda": ["Kaura Namoda","Zurmi","Birnin Magaji"], "Talata Mafara": ["Talata Mafara","Bakura","Maradun"], "Anka": ["Anka","Bukkuyum","Tsafe"] },
};

const STATE_OPTIONS = Object.keys(LOCATIONS).sort().map(s => ({ value: s, label: s }));

const SelectField = ({ label, name, value, onChange, options, disabled, placeholder = "Select" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full h-10 px-3 pr-8 border border-gray-300 rounded-lg text-sm bg-white appearance-none outline-none
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400" : "text-gray-900 cursor-pointer"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
        {disabled ? "—" : "▾"}
      </span>
    </div>
  </div>
);

export default function TypeLocationSection({ data, onChange }) {
  const cityOptions = data.state
    ? Object.keys(LOCATIONS[data.state] ?? {}).sort().map(c => ({ value: c, label: c }))
    : [];

  const areaOptions = data.state && data.city
    ? (LOCATIONS[data.state]?.[data.city] ?? []).sort().map(a => ({ value: a, label: a }))
    : [];

  const handleStateChange = (name, value) => {
    onChange(name, value);
    onChange("city", "");
    onChange("area", "");
  };

  const handleCityChange = (name, value) => {
    onChange(name, value);
    onChange("area", "");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-5">

      {/* Row 1 — Type / Purpose / Label: 1 col on mobile, 3 on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <SelectField label="Type"    name="type"    value={data.type}    onChange={onChange} options={TYPES} />
        <SelectField label="Purpose" name="purpose" value={data.purpose} onChange={onChange} options={PURPOSES} />
        <SelectField label="Label"   name="label"   value={data.label}   onChange={onChange} options={LABELS} />
      </div>

      {/* Row 2 — State / City / Area: 1 col on mobile, 3 on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <SelectField
          label="State"
          name="state"
          value={data.state}
          onChange={handleStateChange}
          options={STATE_OPTIONS}
          placeholder="Select State"
        />
        <SelectField
          label="City"
          name="city"
          value={data.city}
          onChange={handleCityChange}
          options={cityOptions}
          disabled={!data.state}
          placeholder={!data.state ? "Select state first" : "Select City"}
        />
        <SelectField
          label="Area / LGA"
          name="area"
          value={data.area}
          onChange={onChange}
          options={areaOptions}
          disabled={!data.city}
          placeholder={!data.city ? "Select city first" : "Select Area"}
        />
      </div>

      {/* Address + ZipCode: stack on mobile, side by side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            placeholder="Enter Address/Estate"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Zip Code <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="e.g. 100001"
            value={data.zipCode || ""}
            onChange={(e) => onChange("zipCode", e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
      </div>
    </div>
  );
}