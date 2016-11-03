/**
 * Parser model events
 */

'use strict';

import {EventEmitter} from 'events';
import Parser from './parser.model';
var ParserEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ParserEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Parser.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ParserEvents.emit(event + ':' + doc._id, doc);
    ParserEvents.emit(event, doc);
  };
}

export default ParserEvents;
