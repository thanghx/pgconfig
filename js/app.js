var pgConfigApp = angular.module('pgConfig', []);

pgConfigApp.controller('ConfigurationController', function ($scope, $http) {
  $http.get('data/enviroments.json').success(function(data) {
    $scope.enviroments = data;
  });

  $http.get('data/pgsql-parameters.json').success(function(data) {
    $scope.pgsql_parameters = data;
  });
});

pgConfigApp.filter('process_formula', function() {
  return function(input, total_ram, max_value, max_connections) {

  	var new_formula=
    input.replace('TOTAL_RAM', to_bytes(total_ram + 'GB'));


    if (max_connections != null) {
      new_formula = new_formula.replace('MAX_CONNECTIONS', max_connections)
    };


  	var resultData = eval(new_formula);
  	
  	if (max_value != null) {
	  	var max_value_bytes = to_bytes(max_value);

	  	if (resultData > max_value_bytes) {
	  		resultData = max_value_bytes;
	  	};
  	};

    return resultData;
  };
});

function to_bytes(bytes, precision) {
  // console.info('asfasfafs');

    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    if (typeof precision === 'undefined') precision = 0;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
    number = Math.floor(Math.log(bytes) / Math.log(1024));

        console.info(number);
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  units[number];
};

pgConfigApp.filter('format_field', function() {
  return function(input, format) {


    if (format != null) {
      if (format === "bytes") {
        if (isNaN(parseFloat(input)) || !isFinite(input)) return '-';
        if (typeof precision === 'undefined') precision = 2;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
        number = Math.floor(Math.log(input) / Math.log(1024));
        return (input / Math.pow(1024, Math.floor(number))).toFixed(precision) +  units[number];
      };

    };
    return input;
  }
}); 


pgConfigApp.filter('to_bytes', function() {
  return function(input) {
    return to_bytes(input);
  };
});

pgConfigApp.filter('adjust_version', function() {
  return function(input, version) {
    return input.replace('PG_VERSION', version);
  };
});

function to_bytes(input) {
	var returnValue = 0;
  
  if (String(input).toUpperCase().indexOf("PB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024 * 1024 * 1024 * 1024 * 1024;
  } else if (String(input).toUpperCase().indexOf("TB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024 * 1024 * 1024 * 1024;
  } else if (String(input).toUpperCase().indexOf("GB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024 * 1024 * 1024;
  } else if (String(input).toUpperCase().indexOf("MB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024 * 1024;
  } else if (String(input).toUpperCase().indexOf("KB") !=-1) {
    returnValue = input.match(/[0-9]{1,}/i)[0] * 1024;
  }

	return returnValue;
}