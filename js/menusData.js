var data = "Armor,Shield,Defense,Guard\n" +
    "Happy,Cheerful,Delighted,Ecstatic\n" +
    "Carbon,Graphite,Charcoal,Coal\n" +
    "Hyena,Fox,Wolf,Coyote\n" +
    "Apology,Excuse,Regret,Confession\n" +
    "Child,Infant,Newborn,Toddler\n" +
    "Horror,Comedy,Romance,Adventure\n" +
    "Steel,Alloy,Aluminum,Gold\n" +
    "Little,Slight,Insufficient,Meager\n" +
    "Creative,Imaginative,Inventive,Innovative\n" +
    "Fabric,Nylon,Linen,Weave\n" +
    "Cottage,Bungalow,Mansion,Townhouse\n" +
    "French,Francophone,Napoleonic,Huguenot\n" +
    "Beaver,Otter,Raccoon,Weasel\n" +
    "Surgeon,Psychologist,Pathologist,Gynecologist\n" +
    "Grape,Berry,Melon,Fig\n" +
    "Engine,Compressor,Exhaust,Cylinder\n" +
    "Noise,Hiss,Vibration,Distortion\n" +
    "Landscape,Garden,Greenhouse,Botanic\n" +
    "Chemical,Catalysis,Radiology,Enzymology\n" +
    "Early,Late,Initial,Future\n" +
    "Western,Eastern,Northern,Southern\n" +
    "Pilot,Aviator,Wingman,Starfighter\n" +
    "Light,Lamp,Led,Fire\n" +
    "Address,Email,Postcode,Mail\n" +
    "Elephant,Rhinoceros,Giraffe,Hippopotamus\n" +
    "Mountain,Canyon,Valley,Ridge\n" +
    "Zoo,Safari,Wildlife,Aquarium\n" +
    "Audience,Applause,Cheer,Crowd\n" +
    "Hypnosis,Telepathy,Illusion,Supernatural\n" +
    "Art,Museum,Sculpture,Gallery\n" +
    "Face,Hair,Neck,Head\n" +
    "Habit,Routine,Lifestyle,Pattern\n" +
    "Plaid,Checkered,Striped,Dotted\n" +
    "Royal,Majestic,Imperial,Monarchic\n" +
    "Large,Big,Wide,Spacious\n" +
    "Fail,Lose,Fall,Crash\n" +
    "Daydream,Fantasy,Wonder,Fairytale\n" +
    "Frustration,Anger,Outburst,Annoyance\n" +
    "Estimate,Approximate,Assess,Speculate\n" +
    "Alien,Invaders,Spaceship,Planet\n" +
    "Iron,Stove,Refrigerator,Heater\n" +
    "Poetic,Rhyming,Philosophic,Aesthetic\n" +
    "Jewel,Gemstone,Charm,Crystal\n" +
    "Export,Import,Quota,Market\n" +
    "Association,Society,Organization,Federation\n" +
    "Feeling,Sentiment,Emotion,Sensation\n" +
    "Blossom,Bloom,Spring,Flower\n" +
    "Grin,Smile,Laugh,Smirk\n" +
    "Rubber,Latex,Silicone,Plastic\n" +
    "Falcon,Hawk,Owl,Eagle\n" +
    "Python,Anaconda,Cobra,Rattlesnake\n" +
    "Wealthy,Prosperous,Substantial,Opulent\n" +
    "Old,Ancient,Decrepit,Antiquated\n" +
    "Scar,Blister,Crater,Defect\n" +
    "Hare,Rodent,Rabbit,Buck\n" +
    "Neon,Glitzy,Effulgent,Lambent\n" +
    "Butcher,Barber,Blacksmith,Shoemaker\n" +
    "Force,Coercion,Fury,Dynamism\n" +
    "Electric,Magnetic,Voltaic,Motor,driven\n" +
    "Code,Cipher,Cryptography,Encryption\n" +
    "Whale,Orca,Dolphin,Shark\n" +
    "Connection,Linkage,Correlation,Relation\n" +
    "Clover,Sunflower,Daisy,Cotton\n" +
    "Factual,Circumstantial,Legitimate,Unbiased\n" +
    "Expert,Master,Guru,Mentor\n" +
    "Sphere,Radius,Ellipsoid,Torus\n" +
    "Daughter,Girl,Woman,Female\n" +
    "Breath,Inhale,Exhale,Gasp\n" +
    "Kitten,Puppy,Cub,Pony\n" +
    "Treasure,Pirate,Chest,Quest\n" +
    "Almond,Peanut,Walnut,Chestnut";
var getWordGroups = function(wordSet) {//To split the words string into groups and words
    var groups = wordSet.split(/\r\n|\n/);
    var words = [];
    for (var i=0; i<groups.length; i++) {
        var data;
        //I spent one full hour convincing Firefox to
        // see the comma, yet it didn't want to!
        data = groups[i].split(String.fromCharCode(wordSet.charCodeAt(5)));
        words.push(data);
    }
    return words;
};