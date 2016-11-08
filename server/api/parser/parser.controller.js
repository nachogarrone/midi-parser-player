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
var JParser = require('jison').Parser;
var stringify = require('node-stringify');

var grammar = {
  "lex": {
    "rules": [
      ["=", "return 'IGUAL';"],
      ["time", "return 'TIME';"]
      // ["bpm", "return 'BPM';"],
      // ["r", "return 'SILENCIO';"],
      // ["-", "return 'GUION';"],
      // ["/", "return 'BARRA';"],
      // ["|", "return 'SIMPLE';"],
      // ["||", "return 'FIN';"],
      // ["|:", "return 'INICIO_REPETICION';"],
      // [":|", "return 'FIN_REPETICION';"],
      // ["[A-G]", "return 'NOTA';"],
      // ["[1-8]", "return 'OCTAVA';"], -
      //   ["2\/4|3\/4|4\/4|C", "return 'VALOR_COMPAS';"],
      // ["[0-9]+", "return 'NUM';"],
      // ["w|h|q|8|16|32|64", "return 'VALOR';"],
      // ["\#{1,2}|\@{1,2}|n", "return 'ALTERACION';"],
      // ["[\t\r\n\f\v]+", "/* ignore */"]
    ]
  },
  // "operators": [],
  "bnf": {
    "signo_igual": ["signo_igual IGUAL",
      "IGUAL"],
    "time": ["time TIME",
      "TIME"]
    // "bpm": ["bpm BPM",
    //   "BPM"],
    // "silencio": ["silencio SILENCIO",
    //   "SILENCIO"],
    // "guion": ["guion GUION",
    //   "GUION"],
    // "barra": ["barra BARRA",
    //   "BARRA"],
    // "simple": ["simple SIMPLE",
    //   "SIMPLE"],
    // "fin": ["fin FIN",
    //   "FIN"],
    // "inicio_repeticion": ["inicio_repeticion INICIO_REPETICION",
    //   "INICIO_REPETICION"],
    // "fin_repeticion": ["fin_repeticion FIN_REPETICION",
    //   "FIN_REPETICION"],
    // "nota": ["nota NOTA",
    //   "NOTA"],
    // "octava": ["octava OCTAVA",
    //   "OCTAVA"],
    // "valor_compas": ["valor_compas VALOR_COMPAS",
    //   "VALOR_COMPAS"],
    // "numero": ["numero NUM",
    //   "NUM"],
    // "valor": ["valor VALOR",
    //   "VALOR"],
    // "alteracion": ["alteracion ALTERACION",
    //   "ALTERACION"],
    // "partitura": [["partitura PARTITURA",
    //   "PARTITURA"], ["BPM IGUAL NUM TIME IGUAL VALOR_COMPAS LISTA_COMPAS FIN", "$$ = PARTITURA($7(COMPAS($7.length())),$6,$3)"]],
    // "nodoNota": [["nodoNota NODONOTA",
    //   "NODONOTA"], ["NOTA", "$$ = $1"], ["NOTA ALTERACION", "$$ = $1,$2"]],
    // "simbolo": [["simbolo SIMBOLO",
    //   "SIMBOLO"], ["rnota BARRA OCTAVA BARRA VALOR", "$$ = NOTA($1(NODONOTA($1.length())),$3,$5);"], ["SILENCIO BARRA VALOR", "$$ = SILENCIO($3);"]],
    // "compas": [["compas COMPAS",
    //   "COMPAS"], ["SIMBOLOS_COMPAS", "$$ = COMPAS($2(SIMBOLO($2.length())));"]],
    // "rnota": [["nodoNota LISTA_NODO_NOTAS", "$$ = LISTA_NODO_NOTA.push($1)"], ["rnota GUION nodoNota LISTA_NODO_NOTAS", "$$ = $1.push($3);$4=$1"]],
    // "simbolo_compas": [["simbolo", "$$ = simbolo.push($1);return simbolo;"], ["simbolo_compas simbolo", "$$ = $1.push($2);"]],
    // "listaCompas": [["compas", "$$ = compas.push($1);return compas;"], ["listaCompas SIMPLE compas", "$$ = $1.push($2);"], ["INICIO_REPETICION listaCompas FIN_REPETICION", "$$ = $1.push($2);"]]
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
    result = gparser.parse(input);
    console.log("result");
    console.log("parse: " + stringify(result));
  } catch (err) {
    // console.error("Error parsing input: " + err);
  }
  var statusCode = 400;
  if (result == true) {
    statusCode = 200;
  } else {
    statusCode = 400;
  }
  return res.status(statusCode).json(result);
}

// Creates a new Parser in the DB
export function create(req, res) {
  return Parser.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
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
