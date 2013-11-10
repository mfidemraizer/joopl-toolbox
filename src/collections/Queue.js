/*
 Copyright Matias Fidemraizer
 http://matiasfidemraizer.com
 http://www.linkedin.com/in/mfidemraizer/en

 jOOPL Toolbox
 https://github.com/mfidemraizer/joopl-toolbox

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
(function() {
    "use strict";

	/*

	Queue.js

	A function to represent a queue

	Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
	the terms of the CC0 1.0 Universal legal code:

	http://creativecommons.org/publicdomain/zero/1.0/legalcode

	*/

	/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
	 * items are added to the end of the queue and removed from the front.
	 */
	function Queue() {
		  // initialise the queue and offset
		  var queue  = [];
		  var offset = 0;

		  this.underlyingQueue = [];

		  /* Returns the length of the queue.
		   */
		  this.getLength = function(){

		    // return the length of the queue
		    return (queue.length - offset);

		  }

		  /* Returns true if the queue is empty, and false otherwise.
		   */
		  this.isEmpty = function(){

		    // return whether the queue is empty
		    return (queue.length == 0);

		  }

		  /* Enqueues the specified item. The parameter is:
		   *
		   * item - the item to enqueue
		   */
		  this.enqueue = function(item){

		    // enqueue the item
		    queue.push(item);

		  }

		  /* Dequeues an item and returns it. If the queue is empty then undefined is
		   * returned.
		   */
		  this.dequeue = function(){

		    // if the queue is empty, return undefined
		    if (queue.length == 0) return undefined;

		    // store the item at the front of the queue
		    var item = queue[offset];

		    // increment the offset and remove the free space if necessary
		    if (++ offset * 2 >= queue.length){
		      queue  = queue.slice(offset);
		      offset = 0;
		    }

		    // return the dequeued item
		    return item;

		  }

		  /* Returns the item at the front of the queue (without dequeuing it). If the
		   * queue is empty then undefined is returned.
		   */
		  this.peek = function(){

		    // return the item at the front of the queue
		    return (queue.length > 0 ? queue[offset] : undefined);

		  }
	}

	/**
		@namespace joopl.collections
	*/

	$namespace.register("joopl.collections", function() {

		/**
			Represents a FIFO (First-In, First-Out) collection of objects

			@class Queue
			@extends joopl.collections.Enumerable
			@final
		*/
		this.declareClass("Queue", {
			inherits: this.Enumerable,
			ctor: function(args) {
				this._.queue = new Queue();
			},
			members: {
				get enumerator() {
					return new $global.joopl.collections.ListEnumerator({ itemArray: this._.queue.underlyingQueue }));
				},

				get queue() {
					return this._.queue;
				},

				count: function(predicateFunc) {
					if(predicateFunc instanceof Function) {
						return this.base.count(predicateFunc);
					} else {
						return this.queue.getLength();
					}
				},

				/**
					Enqueues a new item

					@method enqueue
					@param {object} item The whole item to enqueue
					@return void This method returns `void`
				*/
				enqueue: function(item) {
					this.queue.enqueue(item);
				},

				addRange: function(enumerable) {
					enumerable.forEach((function(item) {
						this._.derived.add(item);
					}).bind(this));
				},

				/**
					Dequeues an item from the queue

					@method dequeue
					@return object The dequeued item
				*/
				dequeue: function() {
					return this._.queue.dequeue();
				},

				/**
					Gets next item to dequeue without dequeueing it

					@method peek
					@return object The next item in the queue
				*/
				peek: function() {
					return this._.queue.peek();
				}
			}
		});
	});
})();