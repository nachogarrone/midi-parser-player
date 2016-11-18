/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/parsers              ->  index
 * POST    /api/parsers              ->  create
 * GET     /api/parsers/:id          ->  show
 * PUT     /api/parsers/:id          ->  upsert
 * PATCH   /api/parsers/:id          ->  patch
 * DELETE  /api/parsers/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Parser from './parser.model';
import midiParser from './midiparser';

import Partitura from './ast/Partitura';
import Compas from './ast/Compas';
import Nota from './ast/Nota';
import NodoNota from './ast/NodoNota';

var JParser = require('jison').Parser;
var stringify = require('node-stringify');
var fs = require('fs');
var Midi = require('jsmidgen');


var grammar = {
  "lex": {
    "rules": [
      ["[ \\t\\r\\n\\f]+",    "/* ignore */"],
      ["=",                   "return 'IGUAL';"],
      ["time",                "return 'TIME';"],
      ["bpm",                 "return 'BPM';"],
      ["r",                   "return 'SILENCIO';"],
      ["-",                   "return 'GUION';"],
      ["\\/",                 "return 'BARRA';"],
      ["\\|\\|",              "return 'FIN';"],
      ["\\|:",                "return 'INICIO_REPETICION';"],
      ["\\|",                 "return 'SIMPLE';"],
      [":\\|",                "return 'FIN_REPETICION';"],
      ["[A-G]",               "return 'NOTA';"],
      ["2\\/4|3\\/4|4\\/4|C", "return 'VALOR_COMPAS';"],
      ["[0-9]+",              "return 'NUM';"],
      ["w|h|q|8|16|32|64",    "return 'VALOR';"],
      ["#{1,2}|@{1,2}|n",     "return 'ALTERACION';"]
    ]
  },
  "start": "partitura",
  "bnf": {
    "partitura":          [
      ["BPM IGUAL NUM TIME IGUAL VALOR_COMPAS lista_compas FIN", "$$ = ['partitura',['compas',$7],$6,$3]"]
    ],
    "lista_compas":       [
      ["compas", "$$ = [$1];"],
      ["SIMPLE compas lista_compas ", "$$ = $3; $$.push($2);"],
      ["SIMPLE compas", "$$ = $2;"],
      ["INICIO_REPETICION compas lista_compas", "$$ = $3; $$.push($2);"],
      ["SIMPLE compas FIN_REPETICION ", "$$ = $2;"]
    ],
    "compas":             [
      ["compas simbolo", "$$ = $1; $1.push($2);"],
      ["simbolo", "$$ = ['simbolo', $1];"]
    ],
    "simbolo":            [
      ["nodoNota BARRA NUM BARRA VALOR", "$$ = ['nota',['nodonota',$1,$3,$5]];"],
      ["SILENCIO BARRA VALOR", "$$ = ['simbolo',$3];"]
    ],
    "nodoNota":           [
      ["nodoNota NODONOTA", ['nodonota']],
      ["NOTA", "$$ = $1"],
      ["NOTA ALTERACION", "$$ = $1,$2"]
    ]
  }
};

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Parsers
export function index(req, res) {
  console.log('ejecutando index...');
  console.log(req.query.id);
  return Parser.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Parser from the DB
export function show(req, res) {
  var result = false;
  try {
    var input = req.params.id;
    console.log("input: " + input);
    var gparser = new JParser(grammar);
    console.log(stringify(gparser));
    result = gparser.parse(input);
    console.log("parse: " + stringify(result));
  } catch (err) {
    console.error("Error parsing input: " + stringify(err));
  }
  var statusCode = 400;
  if (result == true) {
    statusCode = 200;
  } else {
    statusCode = 400;
  }
  console.log(stringify(result));
  return res.status(statusCode).json(result);
}

// Creates a new Parser in the DB
export function create(req, res) {
  var result = false;
  try {
    var input = req.body.input;
    console.log("input: " + stringify(input));

     var midiP = midiParser.parser;
     var result = midiP.parse(input);
     console.log(stringify(result));

     var part = result[1];
     var comp = part[1];
    var largo=comp.length;
     //var simb = comp[1][0];
     //var not = simb[1];
     //var nodoNot = not[1];

     console.log('*********');
     console.log(part);
     console.log(comp);
    console.log(largo);
     //console.log(not);
     //console.log(nodoNot);

     console.log('*********');
     const nodoNotaImpl = new NodoNota(nodoNot[1]);
     const notaImpl = new Nota(nodoNot[1],nodoNot[2],nodoNot[3]);
     const compasImpl = new Compas([notaImpl]);
     const partituraImpl = new Partitura("", part[2], part[3]);
     console.log(nodoNotaImpl.toString());
     console.log(nodoNotaImpl.unparse());
     console.log(notaImpl.toString());
     console.log(notaImpl.unparse());
     console.log(partituraImpl.toString());
     console.log(compasImpl.unparse());
     console.log(compasImpl.toString());

     var file = new Midi.File();
     var track = new Midi.Track();
     file.addTrack(track);

    // addNote(canal, pith(numero o simbolo), duracion)
    track.addNote(0, notaImpl.notas+notaImpl.octava, 64);
    // track.addNote(0, 'd4', 64);
    // track.addNote(0, 'e4', 64);
    // track.addNote(0, 'f4', 64);
    // track.addNote(0, 'g4', 64);
    // track.addNote(0, 'a4', 64);
    // track.addNote(0, 'b4', 64);
    // track.addNote(0, 'c5', 64);

      fs.writeFileSync('test.mid', file.toBytes(), 'binary');


    // ESTO ES PARA GENERAR EL PARSER
    // var gparser = new JParser(grammar);
    //
    // // generate source, ready to be written to disk
    // var parserSource = gparser.generate();
    // var fs = require('fs');
    // fs.writeFile("/tmp/test.js", parserSource, function(err) {
    //   if(err) {
    //     return console.log(err);
    //   }
    //   console.log("The file was saved!");
    // });
    // console.log(stringify(parserSource));

  } catch (err) {
    console.error("Error parsing input: " + err.message +" "+ err.stack);//stringify(err));
  }
  var statusCode = 400;
  if (result == true) {
    statusCode = 200;
  } else {
    statusCode = 400;
  }
  return res.status(statusCode).json(result);
}

// Upserts the given Parser in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Parser.findOneAndUpdate({_id: req.params.id}, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Parser in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Parser.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Parser from the DB
export function destroy(req, res) {
  return Parser.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
