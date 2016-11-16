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
import Nota from './ast/Nota';
var JParser = require('jison').Parser;
var stringify = require('node-stringify');

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
      // ["[1-8]",               "return 'OCTAVA';"],
      ["2\\/4|3\\/4|4\\/4|C", "return 'VALOR_COMPAS';"],
      ["[0-9]+",              "return 'NUM';"],
      ["w|h|q|8|16|32|64",    "return 'VALOR';"],
      ["#{1,2}|@{1,2}|n",     "return 'ALTERACION';"]
    ]
  },
  // "operators": [
  //     ["left", "BARRA"]
  // ],
  "start": "partitura",
  "bnf": {
    "partitura":          [//["partitura PARTITURA", ['partitura']],
                            ["BPM IGUAL NUM TIME IGUAL VALOR_COMPAS lista_compas FIN", "$$ = ['partitura',['compas',$7],$6,$3]"]],
    "lista_compas":       [
      ["compas", "$$ = [$1];"],
      ["compas SIMPLE lista_compas ", "$$ = $1; $$.push($3);"],
      ["INICIO_REPETICION lista_compas FIN_REPETICION", "$$ = $1; $$.push($2);"]
    ],
    "compas":             [
      ["compas simbolo", "$$ = $1; $1.push($2);"],
      ["simbolo", "$$ = ['simbolo', $1];"]
    ],
    // "simbolo_compas":     [
    //   ["simbolo", "$$ = [$1];"],
    //   ["simbolo_compas simbolo", "$$ = $1; $$.push($2);"]
    // ],
    "simbolo":            [
      ["nodoNota BARRA NUM BARRA VALOR", "$$ = ['nota',['nodonota',$1,$3,$5]];"],
      ["SILENCIO BARRA VALOR", "$$ = ['simbolo',$3];"]
    ],
    // "repeatNota":              [
    //   ["nodoNota LISTA_NODO_NOTAS", "$$ = LISTA_NODO_NOTA.push($1)"],
    //   ["repeatNota GUION nodoNota LISTA_NODO_NOTAS", "$$ = $1.push($3);$4=$1"]
    // ],
    "nodoNota":           [
      ["nodoNota NODONOTA", ['nodonota']],
      ["NOTA", "$$ = $1"],
      ["NOTA ALTERACION", "$$ = $1,$2"]
    ]

    // "signo_igual":        ["signo_igual IGUAL", ['igual']],
    // "time":               ["time TIME", ['time']],
    // "bpm":                ["bpm BPM", ['bpm']],
    // "silencio":           ["silencio SILENCIO", ['silencio']],
    // "guion":              ["guion GUION", ['guion']],
    // "barra":              ["barra BARRA", ['barra']],
    // "simple":             ["simple SIMPLE", ['simple']],
    // "fin":                ["fin FIN", ['fin']],
    // "inicio_repeticion":  ["inicio_repeticion INICIO_REPETICION", ['inicio_repeticion']],
    // "fin_repeticion":     ["fin_repeticion FIN_REPETICION", ['fin_repeticion']],
    // "nota":               ["nota NOTA", ['nota']],
    // "octava":             ["octava OCTAVA", ['octava']],
    // "valor_compas":       ["valor_compas VALOR_COMPAS", ['valor_compas']],
    // "numero":             ["numero NUM", ['num']],
    // "valor":              ["valor VALOR", ['valor']],
    // "alteracion":         ["alteracion ALTERACION", ['alteracion']]
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
    var gparser = new JParser(grammar);
    // console.log(stringify(gparser));
    result = gparser.parse(input);
    console.log("parse: " + stringify(result));
  } catch (err) {
    console.error("Error parsing input: " + err.message +" "+ err.stack);//stringify(err));
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
