(function() {
	$namespace.register("joopl.collections", function() {
		this.Enumerator = $def({
			$members: {
				moveNext: function() {
					throw new $global.joopl.NotImplementedException();
				},
				hasNext: function() {
					throw new $global.joopl.NotImplementedException();
				}
			}
		});
	});
})();