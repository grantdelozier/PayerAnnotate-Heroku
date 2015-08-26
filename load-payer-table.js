var pg = require('pg');
var https = require('https');


var payer_dict = {"esi": ["ESI", "Express Scripts", "ValueRx", "National Prescription Administrators", "Express Scripts, Inc.", "Express Scripts Incorporated", "ESRX", "Center for Cost-Effective Consumerism", "Express Scripts Inc.", "Express Scripts Inc", "Express Scripts Holding"],
			  "cvs": ["CVS Caremark", "CVS Corp.", "CVS/Caremark Corporation", "CVS Corporation", "CVS Caremark Corp.", "CVS Caremark Corporation", "CVS", "CVS Health"],
			  "uhc": ["UHC", "UnitedHealth Group", "UnitedHealth Group Incorporated", "UnitedHealth", "UnitedHealth Group Inc.", "UnitedHealth Group Inc", "UnitedHealth Group, Inc", "UnitedHealth Group, Inc.", "UnitedHealth Group, Incorporated", "Unitedhealth group", "United healthcare", "United HealthGroup"],
    		  "catamaran": ["Optum RX", "Catamaran", "Catamaran Corporation", "SXC Health Solutions Corp.", "SXC Health Solutions", "Catamaran", "SXC Health", "CTRX"],
    		  "cdmi": ["MGLN", "CDMI", "Magellan Health", "Magellan health", "Magellan Health Inc", "Magellan Health, Inc", "Magellan Health, Inc."],
    		  "prime": ["Prime", "Prime Therapeutics", "Prime therapeutics", "Prime Therapeutics LLC", "Prime Therapeutics, LLC"],
    		  "medimpact": ["Medimpact", "MedImpact Healthcare Systems", "MedImpact Healthcare"],
    		  "envision": ["EVHC" ,"Envision", "Envision Healthcare Holdings", "Envision Healthcare", "Envision Healthcare Holdings Inc", "EmCare", "AMR", "American Healthcare Response", "Evolution Health"],
    		  "aetna": ["AET", "Aetna", "Aetna Incorporated", "Aetna Inc.", "Aetna, Inc.", "Ã†tna", "AEtna", "Aetna Life and Casualty", "Aetna Life Insurance Company", "Aetna Insurance Company"],
    		  "cigna": ["Cigna", "CIGNA Corp.", "CIGNA Corporation", "Cigna HealthCare", "Cigna International Expatriate Benefits", "CIEB", "CIGNA", "CIGNA International Expatriate Benefits", "Connecticut General Life Insurance Company", "CIGNA Healthcare", "Life Insurance Company Of North America"],
   			  "humana": ["HUM", "Humana", "Humana, Inc.", "Humana Incorporated", "Humana Inc.", "Humana Inc", "Humana Military Healthcare Services", "Humana Military Healthcare Services, Inc."],
   			  "anthem": [ "Anthem", "ANTM", "Amerigroup",
	            "WellPoint", "WellPoint Health Networks Incorporated", "Wellpoint", "WellPoint Health Networks", "WellPoint Inc.",
	            "WellPoint, Incorporated", "WellPoint Incorporated", "WellPoint Health Systems", "Wellpoint Health Networks", "Well Point",
	            "Anthem BlueCross BlueShield of Colorado", "Anthem BlueCross BlueShield of Connecticut",
	            "Anthem BlueCross BlueShield of Indiana", "Anthem BlueCross BlueShield of Kentucky",
	            "Anthem BlueCross BlueShield of Maine", "Anthem BlueCross BlueShield of Missouri",
	            "Anthem BlueCross BlueShield of Nevada", "Anthem BlueCross BlueShield of New Hampshire",
	            "Anthem BlueCross BlueShield of Ohio", "Anthem BlueCross BlueShield of Parts of Virginia",
	            "Anthem BlueCross BlueShield of Wisconsin", "Anthem Blue Cross California",
	            "BlueCross BlueShield of Georgia", "Empire BlueCross and BlueShield"],
	          "hcsc": ["Health Care Service Corporation", "Blue Cross and Blue Shield of Texas", "Blue Cross and Blue Shield of Illinois",
	          	"HCSC", "Blue Cross and Blue Shield of Montana", "Blue Cross and Blue Shield of New Mexico",
	          	"Blue Cross and Blue Shield of Oklahoma", "Dearborn National"]
	        }

console.log(process.env.DATABASE_URL)

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	if (err) {
		console.error(err)
	}
	else{
		Object.keys(payer_dict).forEach(function(key){
			var k = key;
			var vals = payer_dict[key].join(", ")
			client.query("INSERT INTO payer_types (key, names) VALUES($1, $2);", [k, vals], function(err2, result){
				if (err2) {
					console.error(err2);
				}
				 else {
					console.log(result);
				}
			});
		});
	}
	done();
});
