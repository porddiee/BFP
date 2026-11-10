const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const SURIGAO_STATION_ID = "8d5f9a9b-d989-470b-8834-5a704f3899cc";
const ALEGRIA_STATION_ID = "fe2f238c-94e8-4f53-874a-5ff760de0ddf";

async function seed() {
  console.log("Starting real data seeding for BFP Surigao...");

  // 1. UPDATE STATIONS WITH ACCURATE DATA
  console.log("Updating stations...");
  await supabase.from("stations").update({
    name: "BFP Surigao City Central Fire Station",
    address: "City Hall Compound, Parrucho Street, Barangay Washington, Surigao City, Surigao del Norte",
    contact_number: "0931-721-8790 / 0926-226-0360",
    contact_number: "0931-721-8790",
    email: "surigaocityfirestation@yahoo.com",
    district: "Surigao City Command • District 2",
    district: "Surigao City • Dist 2",
    is_active: true,
    approval_status: "approved"
  }).eq("id", SURIGAO_STATION_ID);

  await supabase.from("stations").update({
    name: "Alegria Municipal Fire Station",
    address: "Government Center Compound, Barangay Julio Ouano, Alegria, Surigao del Norte",
    contact_number: "0910-235-9744",
    email: "alegria.firestation@bfp.gov.ph",
    district: "District 1 • Mainland Surigao del Norte",
    is_active: true,
    approval_status: "approved"
  }).eq("id", ALEGRIA_STATION_ID);

  // 2. UPDATE EXISTING ALEGRIA USER PROFILE
  await supabase.from("profiles").update({
    first_name: "Julieto",
    last_name: "Malbuezo",
    contact_number: "0910-235-9744",
    role: "station_user",
    approval_status: "approved"
  }).eq("email", "alegria@bfp.gov.ph");

  // Update existing station_member for alegria
  await supabase.from("station_members").update({
    position: "Municipal Fire Marshal / Station Commander",
    rank: "Senior Fire Officer 2",
    is_active: true
  }).eq("station_id", ALEGRIA_STATION_ID);

  // 3. SEED PERSONNEL FOR SURIGAO CITY & ALEGRIA
  const surigaoOfficers = [
    {
      email: "quinto.eduardo@bfp.gov.ph",
      first_name: "Eduardo",
      last_name: "Quinto Jr.",
      contact: "0931-721-8790",
      rank: "Senior Inspector",
      position: "City Fire Marshal / Station Commander",
    },
    {
      email: "alcantara.rommel@bfp.gov.ph",
      first_name: "Rommel",
      last_name: "Alcantara",
      contact: "0926-226-0361",
      rank: "Senior Fire Officer 4",
      position: "Deputy City Fire Marshal / Chief of Operations",
    },
    {
      email: "morales.mc@bfp.gov.ph",
      first_name: "Maria Cristina",
      last_name: "Morales",
      contact: "0917-882-4190",
      rank: "Senior Fire Officer 3",
      position: "Chief, Fire Safety Enforcement Section (FSES)",
    },
    {
      email: "eder.danilo@bfp.gov.ph",
      first_name: "Danilo",
      last_name: "Eder",
      contact: "0919-553-1124",
      rank: "Senior Fire Officer 2",
      position: "Chief, Arson Investigation & Intelligence Unit",
    },
    {
      email: "bacasmas.ryan@bfp.gov.ph",
      first_name: "Ryan",
      last_name: "Bacasmas",
      contact: "0949-332-9011",
      rank: "Senior Fire Officer 1",
      position: "Special Rescue Unit (SRU) Commander / Tactical Diver",
    },
    {
      email: "caballes.jerome@bfp.gov.ph",
      first_name: "Jerome",
      last_name: "Caballes",
      contact: "0928-445-6623",
      rank: "Fire Officer 3",
      position: "Shift Alpha Commander / Senior Pump Operator",
    },
    {
      email: "plaza.arlene@bfp.gov.ph",
      first_name: "Arlene",
      last_name: "Plaza",
      contact: "0939-771-4452",
      rank: "Fire Officer 3",
      position: "Senior EMT / Lead Paramedic (EMS Response Unit)",
    },
    {
      email: "solon.mc@bfp.gov.ph",
      first_name: "Mark Christian",
      last_name: "Solon",
      contact: "0915-667-8891",
      rank: "Fire Officer 2",
      position: "Heavy Vehicle Extrication Specialist (RTR Rescue)",
    },
    {
      email: "rivas.kevin@bfp.gov.ph",
      first_name: "Kevin Paul",
      last_name: "Rivas",
      contact: "0927-119-3345",
      rank: "Fire Officer 1",
      position: "Lead Nozzleman / Water Rescue Technician",
    },
    {
      email: "maturan.jayson@bfp.gov.ph",
      first_name: "Jayson",
      last_name: "Maturan",
      contact: "0908-552-1980",
      rank: "Fire Officer 1",
      position: "Emergency Medical Technician / Ambulance Driver",
    },
  ];

  const alegriaOfficers = [
    {
      email: "villacorta.rodrigo@bfp.gov.ph",
      first_name: "Rodrigo",
      last_name: "Villacorta",
      contact: "0910-442-8812",
      rank: "Senior Fire Officer 2",
      position: "Station Logistics, Supply & Chief Arson Investigator",
    },
    {
      email: "erno.hernando@bfp.gov.ph",
      first_name: "Hernando",
      last_name: "Erno",
      contact: "0912-334-5510",
      rank: "Senior Fire Officer 2",
      position: "Lead Apparatus Driver / Public Information Officer (PIO)",
    },
    {
      email: "lisondra.leizel@bfp.gov.ph",
      first_name: "Leizel",
      last_name: "Lisondra",
      contact: "0921-667-9921",
      rank: "Senior Fire Officer 1",
      position: "Chief of Operations & Fire Safety Enforcement Inspector",
    },
    {
      email: "corias.orlando@bfp.gov.ph",
      first_name: "Orlando",
      last_name: "Corias",
      contact: "0918-774-2231",
      rank: "Fire Officer 3",
      position: "Senior Nozzleman & Station Arson Investigator",
    },
    {
      email: "daguplo.glenn@bfp.gov.ph",
      first_name: "Glenn",
      last_name: "Daguplo",
      contact: "0929-114-6638",
      rank: "Fire Officer 2",
      position: "RTR Rapid Tactical Rescue & Extrication Specialist",
    },
    {
      email: "virtudazo.maricar@bfp.gov.ph",
      first_name: "Maricar",
      last_name: "Virtudazo",
      contact: "0946-881-3309",
      rank: "Fire Officer 1",
      position: "Emergency Medical Technician (EMT) / Dispatcher",
    },
    {
      email: "cagas.renante@bfp.gov.ph",
      first_name: "Renante",
      last_name: "Cagas",
      contact: "0930-554-1187",
      rank: "Fire Officer 1",
      position: "Apparatus Pump Operator & Firefighter",
    },
  ];

  async function createPersonnel(stationId, officers) {
    for (const off of officers) {
      // Check if user already exists
      const { data: existingUser } = await supabase.from("profiles").select("id, user_id").eq("email", off.email).maybeSingle();
      let profileId;

      if (existingUser) {
        profileId = existingUser.id;
        await supabase.from("profiles").update({
          first_name: off.first_name,
          last_name: off.last_name,
          contact_number: off.contact,
          role: "station_user",
          approval_status: "approved"
        }).eq("id", profileId);
      } else {
        // Create in auth.users
        const { data: authRes, error: authErr } = await supabase.auth.admin.createUser({
          email: off.email,
          password: "BfpSurigao2026!",
          email_confirm: true,
        });

        if (authErr) {
          console.warn("Auth user creation error for", off.email, authErr.message);
          continue;
        }

        const { data: newProf, error: profErr } = await supabase.from("profiles").insert({
          user_id: authRes.user.id,
          first_name: off.first_name,
          last_name: off.last_name,
          email: off.email,
          contact_number: off.contact,
          role: "station_user",
          approval_status: "approved",
        }).select().single();

        if (profErr) {
          console.warn("Profile creation error for", off.email, profErr.message);
          continue;
        }
        profileId = newProf.id;
      }

      // Check if station_member exists
      const { data: existingMember } = await supabase
        .from("station_members")
        .select("id")
        .eq("profile_id", profileId)
        .eq("station_id", stationId)
        .maybeSingle();

      if (existingMember) {
        await supabase.from("station_members").update({
          position: off.position,
          rank: off.rank,
          is_active: true
        }).eq("id", existingMember.id);
      } else {
        await supabase.from("station_members").insert({
          profile_id: profileId,
          station_id: stationId,
          position: off.position,
          rank: off.rank,
          is_active: true,
        });
      }
      console.log(`✓ Personnel registered: ${off.rank} ${off.first_name} ${off.last_name} (${off.position})`);
    }
  }

  console.log("Seeding Surigao City Personnel...");
  await createPersonnel(SURIGAO_STATION_ID, surigaoOfficers);

  console.log("Seeding Alegria Personnel...");
  await createPersonnel(ALEGRIA_STATION_ID, alegriaOfficers);

  // 4. SEED REAL APPARATUS AND EQUIPMENT
  console.log("Cleaning and seeding equipment...");
  await supabase.from("equipment").delete().eq("station_id", SURIGAO_STATION_ID);
  await supabase.from("equipment").delete().eq("station_id", ALEGRIA_STATION_ID);

  const surigaoEquipment = [
    {
      station_id: SURIGAO_STATION_ID,
      name: "Rosenbauer NH30 Major Pumper Engine 101",
      type: "Fire Truck",
      serial_number: "BFP-9012 (SRG-ENG-01)",
      status: "operational",
      acquisition_date: "2021-03-15"
    },
    {
      station_id: SURIGAO_STATION_ID,
      name: "Isuzu FVR 900 Heavy Water Tender (2,500 Gallons)",
      type: "Water Tanker",
      serial_number: "SAA-4091 (SRG-TANK-01)",
      status: "operational",
      acquisition_date: "2022-07-20"
    },
    {
      station_id: SURIGAO_STATION_ID,
      name: "Hino 500 Series Rapid Response Engine",
      type: "Fire Truck",
      serial_number: "SAA-8120 (SRG-ENG-02)",
      status: "operational",
      acquisition_date: "2020-11-10"
    },
    {
      station_id: SURIGAO_STATION_ID,
      name: "Toyota Hiace ALS Type II Emergency Ambulance",
      type: "Ambulance",
      serial_number: "BFP-AMB-108",
      status: "operational",
      acquisition_date: "2023-01-18"
    },
    {
      station_id: SURIGAO_STATION_ID,
      name: "Kia K2700 Compact Quick-Attack Fire Apparatus",
      type: "Rescue Vehicle",
      serial_number: "SAA-3190 (SRG-QA-01)",
      status: "operational",
      acquisition_date: "2022-09-05"
    },
    {
      station_id: SURIGAO_STATION_ID,
      name: "Zodiac MilPRO Inflatable Search & Rescue Flood Boat (Yamaha 40HP)",
      type: "Rescue Vehicle",
      serial_number: "SRU-BOAT-SRG-01",
      status: "operational",
      acquisition_date: "2023-04-12"
    },
    {
      station_id: SURIGAO_STATION_ID,
      name: "Holmatro Core Hydraulic Rescue Extrication Kit (Jaws of Life)",
      type: "Rescue Vehicle",
      serial_number: "HOL-EXT-7720",
      status: "operational",
      acquisition_date: "2021-08-30"
    },
    {
      station_id: SURIGAO_STATION_ID,
      name: "Lion Apparel V-Force Structural Turnout Gear Sets (10 Sets)",
      type: "PPE Bunker Gear",
      serial_number: "PPE-LION-2024-SRG",
      status: "operational",
      acquisition_date: "2024-01-10"
    },
    {
      station_id: SURIGAO_STATION_ID,
      name: "Dräger PSS 7000 Carbon Composite SCBA Breathing Units (8 Sets)",
      type: "SCBA Unit",
      serial_number: "SCBA-DRG-401-408",
      status: "operational",
      acquisition_date: "2023-06-25"
    },
    {
      station_id: SURIGAO_STATION_ID,
      name: "Petzl High-Angle Tactical Confined Space & Rope Rescue Kit",
      type: "Rescue Vehicle",
      serial_number: "PTZ-HAR-902",
      status: "operational",
      acquisition_date: "2022-12-01"
    }
  ];

  const alegriaEquipment = [
    {
      station_id: ALEGRIA_STATION_ID,
      name: "Isuzu FTR 850 High-Pressure Primary Fire Engine (1,000 Gallons)",
      type: "Fire Truck",
      serial_number: "SKA-289 (ALG-ENG-01)",
      status: "operational",
      acquisition_date: "2021-05-14"
    },
    {
      station_id: ALEGRIA_STATION_ID,
      name: "Municipal Fast-Attack Water Tender (500 Gallons)",
      type: "Water Tanker",
      serial_number: "SAA-5512 (ALG-PUMP-02)",
      status: "operational",
      acquisition_date: "2020-09-19"
    },
    {
      station_id: ALEGRIA_STATION_ID,
      name: "Hyundai Starex Basic Life Support Emergency Ambulance",
      type: "Ambulance",
      serial_number: "BFP-AMB-204",
      status: "operational",
      acquisition_date: "2022-04-10"
    },
    {
      station_id: ALEGRIA_STATION_ID,
      name: "Tactical Flood Evacuation Rescue Dinghy (Mercury 25HP Outboard)",
      type: "Rescue Vehicle",
      serial_number: "RTR-BOAT-ALG-01",
      status: "operational",
      acquisition_date: "2023-08-15"
    },
    {
      station_id: ALEGRIA_STATION_ID,
      name: "TNT Rescue Hydraulic Cutter & Spreader Extrication Kit",
      type: "Rescue Vehicle",
      serial_number: "TNT-EDC-4031",
      status: "operational",
      acquisition_date: "2022-03-22"
    },
    {
      station_id: ALEGRIA_STATION_ID,
      name: "Bristol Uniforms Structural Firefighting Bunker Suits (6 Sets)",
      type: "PPE Bunker Gear",
      serial_number: "PPE-BRS-ALG-01",
      status: "operational",
      acquisition_date: "2023-11-05"
    },
    {
      station_id: ALEGRIA_STATION_ID,
      name: "MSA G1 Industrial 4500 PSI High-Pressure SCBA Air Packs (6 Sets)",
      type: "SCBA Unit",
      serial_number: "MSA-G1-ALG-01-06",
      status: "operational",
      acquisition_date: "2023-02-14"
    },
    {
      station_id: ALEGRIA_STATION_ID,
      name: "CMC ProSeries High-Angle Confined Space & Rope Rescue Kit",
      type: "Rescue Vehicle",
      serial_number: "CMC-RRK-8812",
      status: "operational",
      acquisition_date: "2022-10-30"
    }
  ];

  await supabase.from("equipment").insert(surigaoEquipment);
  console.log(`✓ Inserted ${surigaoEquipment.length} equipment units for Surigao City Central`);

  await supabase.from("equipment").insert(alegriaEquipment);
  console.log(`✓ Inserted ${alegriaEquipment.length} equipment units for Alegria Fire Station`);

  // 5. SEED REAL INCIDENTS (FIRES & EMS)
  console.log("Seeding incidents...");
  await supabase.from("fire_incidents").delete().eq("station_id", SURIGAO_STATION_ID);
  await supabase.from("fire_incidents").delete().eq("station_id", ALEGRIA_STATION_ID);
  await supabase.from("ems_incidents").delete().eq("station_id", SURIGAO_STATION_ID);
  await supabase.from("ems_incidents").delete().eq("station_id", ALEGRIA_STATION_ID);

  const fires = [
    {
      station_id: SURIGAO_STATION_ID,
      incident_type: "Commercial Structural Fire",
      location: "Rizal Street, Barangay Washington, Surigao City",
      description: "Structural fire reported at a two-story commercial building. 1st and 2nd Alarm declared. Fast containment by Engine 101 and Tanker 01 prevented spread to adjacent buildings. Cause determined as electrical fault from faulty transformer box. No casualties reported.",
      severity: "high",
      status: "resolved",
      reported_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      resolved_at: new Date(Date.now() - 3600000 * 45).toISOString()
    },
    {
      station_id: SURIGAO_STATION_ID,
      incident_type: "Residential Structural Fire",
      location: "Purok 4, Barangay Taft, Surigao City",
      description: "Semi-concrete single-family residence fire caused by unattended liquefied petroleum gas (LPG) stove. Engine 102 responded within 6 minutes. Fire declared under control at 1st Alarm status.",
      severity: "medium",
      status: "resolved",
      reported_at: new Date(Date.now() - 3600000 * 120).toISOString(),
      resolved_at: new Date(Date.now() - 3600000 * 118).toISOString()
    },
    {
      station_id: ALEGRIA_STATION_ID,
      incident_type: "Agricultural Grass & Brush Fire",
      location: "Barangay Julio Ouano (Poblacion), Alegria",
      description: "Open field brush fire threatening nearby residential agricultural plots. Alegria Engine 01 dispatched with fast attack nozzle deployment. Extinguished within 35 minutes.",
      severity: "low",
      status: "resolved",
      reported_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      resolved_at: new Date(Date.now() - 3600000 * 71).toISOString()
    },
    {
      station_id: ALEGRIA_STATION_ID,
      incident_type: "Residential Kitchen Fire",
      location: "Barangay San Pedro, Alegria",
      description: "Minor kitchen fire from localized electrical overload. Controlled by station crew with zero civilian injuries and minimal property damage.",
      severity: "low",
      status: "resolved",
      reported_at: new Date(Date.now() - 3600000 * 180).toISOString(),
      resolved_at: new Date(Date.now() - 3600000 * 179).toISOString()
    }
  ];

  const ems = [
    {
      station_id: SURIGAO_STATION_ID,
      incident_type: "Vehicular Trauma / High-Speed Collision",
      location: "Surigao-Davao Coastal Highway, Km 3, Barangay Luna",
      description: "Head-on collision between delivery truck and motorcycle. Patient sustained blunt trauma, suspected closed femur fracture, and deep lacerations. Cervical collar applied, oxygen administered via non-rebreather mask, vitals stabilized and transported to Caraga Regional Hospital.",
      severity: "critical",
      status: "resolved",
      reported_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      resolved_at: new Date(Date.now() - 3600000 * 23).toISOString()
    },
    {
      station_id: SURIGAO_STATION_ID,
      incident_type: "Acute Cardiac Distress / Chest Pain",
      location: "Borromeo Street, Surigao City Commercial District",
      description: "Elderly female experiencing acute chest pains and difficulty breathing. EMS Unit 108 provided high-flow oxygen, continuous pulse oximetry monitoring, and direct physician handover at Surigao Medical Center.",
      severity: "critical",
      status: "resolved",
      reported_at: new Date(Date.now() - 3600000 * 96).toISOString(),
      resolved_at: new Date(Date.now() - 3600000 * 95).toISOString()
    },
    {
      station_id: ALEGRIA_STATION_ID,
      incident_type: "Motor Vehicle Accident / Road Trauma",
      location: "National Highway, Barangay San Pedro, Alegria",
      description: "Motorcycle collision on curve section. Male rider stabilized with splinting on right forearm, wound dressing applied. Patient transported safely to Alegria Rural Health Unit.",
      severity: "medium",
      status: "resolved",
      reported_at: new Date(Date.now() - 3600000 * 36).toISOString(),
      resolved_at: new Date(Date.now() - 3600000 * 35).toISOString()
    },
    {
      station_id: ALEGRIA_STATION_ID,
      incident_type: "Respiratory Distress / Heat Stroke",
      location: "Barangay Alipao, Alegria",
      description: "Farmer collapsed due to severe heat exhaustion and dehydration. Cool packs applied, intravenous fluids initiated by EMT, transferred to Mainit Medicare Community Hospital.",
      severity: "medium",
      status: "resolved",
      reported_at: new Date(Date.now() - 3600000 * 144).toISOString(),
      resolved_at: new Date(Date.now() - 3600000 * 143).toISOString()
    }
  ];

  await supabase.from("fire_incidents").insert(fires);
  console.log(`✓ Inserted ${fires.length} fire incident reports`);

  await supabase.from("ems_incidents").insert(ems);
  console.log(`✓ Inserted ${ems.length} EMS incident run sheets`);

  console.log("Seeding completed successfully!");
}

seed().catch(console.error);

