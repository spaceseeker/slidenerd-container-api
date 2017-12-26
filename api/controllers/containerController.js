var Docker = require('dockerode');
var dockerObj = new Docker({
    socketPath: '/var/run/docker.sock'
});


exports.list_all_containers = function(req, res) {
    var optsc = {
    	'all' : false,
    	"filters": "{\"label\": [\"container\"]}"
    };

    dockerObj.listImages(optsc).then(
    	function(data) {
    		res.json(data);
    	}).catch(
    		function(err) {
    			console.log(err);
    		}
    	);

    //res.json('hello from me!');
};

exports.run_container = function(req, res) {

	// check if the language is valid
	/*var optsc = {
    	'all' : false,
    	"filters": "{\"label\": [\"container\"]}"
    };

    dockerObj.listImages(optsc).then(
    	function(data) {
    		data.forEach( function (arrayItem)
			{
			    console.log(arrayItem.Labels.container);
			});
    	}).catch(
    		function(err) {
    			res.status(400).json({"stdout": "", "stderr": "", "err": "Failed in language check"});
    			return;
    		}
    	);*/
    console.log('language path is ' + req.params.language);
   	console.log(req.body.language);
   	var language = req.params.language;
    
    if (req.body.tag) language += ":" + req.body.tag;

    console.log('language is ' + language);

    var entryPoint = req.body.entrypoint;
    console.log('entrypoint is ' + entryPoint);

   	
    var optsc = {
        'Hostname': 'glot-runner',
        'User': 'glot',
        'AttachStdin': true,
        'AttachStdout': true,
        'AttachStderr': true,
        'Tty': false,
        'OpenStdin': true,
        'StdinOnce': true,
        'Env': null,
        'Cmd': ['/home/glot/runner'],
        'Entrypoint': '/home/glot/runner',
        //'Dns': ['8.8.8.8', '8.8.4.4'],
        'Image': 'glot/' + language,
        //'NetworkDisabled': 'true',
        'Entrypoint': entryPoint,
        'Volumes': {},
        'VolumesFrom': []
    };

    dockerObj.createContainer(optsc, handler);

    function handler(err, container) {


        var attach_opts = {
            'Detach': false,
            'Tty': false,
            stream: true,
            stdin: true,
            stdout: true,
            stderr: true
        };


    let myPromise = new Promise((resolve, reject) =>
    {
        container.start(function(err, data) {



            container.attach(attach_opts, function handler(err, stream) {
                // Show outputs
                if (err)  
                	{
                		console.log('error here');
                		reject(err);
                	}

                var Writable = require('stream').Writable;
                var myStream = new Writable();
                var errStream = new Writable();
                var output = '';
                var stderr = 'Error: ';

                myStream._write = function write(doc, encoding, next) {

                    var StringDecoder = require('string_decoder').StringDecoder;
                    var decoder = new StringDecoder('utf8');
                    var result = decoder.write(doc);
                    output += result;
                    console.log('result:' + output);
                    next();

                };

                errStream._write = function write(doc, encoding, next) {

                    var StringDecoder = require('string_decoder').StringDecoder;
                    var decoder = new StringDecoder('utf8');
                    var result = decoder.write(doc);
                    stderr += result;
                    console.log('stderr:' + stderr);
                    next();

                };


                //stream.pipe(myStream);
                container.modem.demuxStream(stream, myStream, errStream);

                var Readable = require('stream').Readable;
                var s = new Readable();

                s._read = function noop() {
                    console.log('reading something');
                }; // redundant? see update below		
                s.resume();
                s.pipe(stream);
                s.push(JSON.stringify(req.body));



                container.wait(function(err, data) {
                    if (err) 
                    	{
                    		console.log('wait error');
                    		reject(err);
                    	}
                    console.log('output: ' + output);
                    console.log('stderr: ' + stderr);
                    
                    if (!(output === '')) resolve(output);
                    if (!(stderr === 'Error: ')) resolve(stderr);
                    //resolve(stderr);


                    exit(stream, s, myStream);

                    container.remove(function(err, data) {
                        console.log('container is removed');
                    });
                });

            });
        });

      }).then(
      	function(val){
      		console.log('val is ' + val);
      		var result = '';

      		if (val.startsWith('Error:'))
      		{
      			result = {"stdout": "", "stderr": val.toString(), "err": ""};

      		} else {
      			
      			result = JSON.parse(val);
      		}

      		
      		console.log('output is ' + JSON.stringify(result));
      		res.status(200).json(result);
      	}
      ).catch(
      	function(err) {
      		console.log('error is ' + err);
      		var result = {"stdout": "", "stderr": "", "err": err.toString()};
      		res.status(400).json(result);
      	});
    }

    function resize(container) {
        var dimensions = {
            h: process.stdout.rows,
            w: process.stderr.columns
        };

        if (dimensions.h != 0 && dimensions.w != 0) {
            container.resize(dimensions, function() {});
        }
    }

    function exit(stream, readStream, writeStream) {
        process.stdout.removeListener('resize', resize);
        process.stdin.removeAllListeners();
        process.stdin.resume();
        readStream.unpipe();
        readStream.destroy();
        writeStream.end();
        writeStream.destroy();
        stream.end();
    }
}

exports.run_container1 = function(req, res) {

    var Docker = require('dockerode');
    var dockerObj = new Docker({
        socketPath: '/var/run/docker.sock'
    });

    var optsc = {
        'Hostname': '',
        'User': '',
        'AttachStdin': true,
        'AttachStdout': true,
        'AttachStderr': true,
        'Tty': false,
        'OpenStdin': true,
        'StdinOnce': true,
        'Env': null,
        'Cmd': ['--version'],
        //'Entrypoint': '/home/glot/runner',
        //'Dns': ['8.8.8.8', '8.8.4.4'],
        'Image': 'glot/solidity',
        //'NetworkDisabled': 'true',
        'Volumes': {},
        'VolumesFrom': []
    };

    dockerObj.createContainer(optsc, handler);

    function handler(err, container) {


        var attach_opts = {
            'Detach': false,
            'Tty': false,
            stream: true,
            stdin: true,
            stdout: true,
            stderr: true
        };


    let myPromise = new Promise((resolve, reject) =>
    {
        container.start(function(err, data) {


            container.attach(attach_opts, function handler(err, stream) {
                // Show outputs
                if (err)  reject(err);

                var Writable = require('stream').Writable;
                var myStream = new Writable();
                var output = '';

                myStream._write = function write(doc, encoding, next) {

                    var StringDecoder = require('string_decoder').StringDecoder;
                    var decoder = new StringDecoder('utf8');
                    var result = decoder.write(doc);
                    output += result;
                    console.log('result:' + output);
                    next();

                };


                container.modem.demuxStream(stream, process.stdout, process.stderr);

                
                var Readable = require('stream').Readable;
                var s = new Readable();

                s._read = function noop() {
                    console.log('reading something');
                }; // redundant? see update below		
                s.resume();
                //s.pipe(stream);
                //s.push(JSON.stringify(req.body));
                //s.push(null);


                container.wait(function(err, data) {
                    if (err) reject(err);

                    console.log('output: ' + output);
                    resolve(output);

                    exit(stream, s, myStream);

                    container.remove(function(err, data) {
                        console.log('container is removed');
                    });
                });

            });
        });

      }).then(
      	function(val){
      		console.log('val is ' + val);
      		//output =  JSON.parse(val);
      		//console.log('output is ' + JSON.stringify(output));
      		res.status(200).json(JSON.parse(val));
      	}
      ).catch(
      	function(err) {
      		output =  err;
      		res.json(err);
      	});
    }

    function resize(container) {
        var dimensions = {
            h: process.stdout.rows,
            w: process.stderr.columns
        };

        if (dimensions.h != 0 && dimensions.w != 0) {
            container.resize(dimensions, function() {});
        }
    }

    function exit(stream, readStream, writeStream) {
        process.stdout.removeListener('resize', resize);
        process.stdin.removeAllListeners();
        process.stdin.resume();
        readStream.unpipe();
        readStream.destroy();
        writeStream.end();
        writeStream.destroy();
        stream.end();
    }
}