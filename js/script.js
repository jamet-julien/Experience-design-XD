(function( doc, global){

	var Resize = function( oParam){
		var _oPublic = {},
				_oOption = {
					parent : null,
					poignets : []
				},
				_oEvent  = null,
				_delegateGetSize,
				_delegateClose,
				_delegateResize,
				_isDrag = false,
				_oSizeItem = {width :0, height :0};

		/**
		 * [_init description]
		 * @param  {[type]} oParam [description]
		 * @return {[type]}        [description]
		 */
		function _init( oParam ){
			var sKey = '';

			for( sKey in _oOption ){
					if( oParam[ sKey ]){
						_oOption[ sKey ] = oParam[ sKey ];
					}
			}

			_actionHandler();
			_initSize();
		}

		function _delegate( aCriteria, flistener) {

			return function delegate( e) {
				var el = e.target;
				do {
					if ( aCriteria.indexOf( el) < 0) continue;
					e.delegateTarget = el;
					flistener.apply( this, arguments);
					return;
				} while( (el = el.parentNode) );
			};
		}

		function _openResize( e){
			_isDrag = true;
			_delegateGetSize = _delegate( _oOption.poignets, _getSize);
			doc.body.addEventListener( 'mousemove',  _delegateGetSize);
		}

		/**
		 * [_closeResize description]
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		function _closeResize( e){
			var oDetail = {
					width : 0,
					height : 0
			}, oSizeParent = _getCurrentSize(_oOption.parent), oEvent;

				if( !_isDrag){
				 return false;
			 }else{
				 _isDrag = false;
			 }

			doc.body.removeEventListener( 'mousemove',  _delegateGetSize);

			oDetail.width  =	Math.round( oSizeParent.width / _oSizeItem.width)    * _oSizeItem.width  + 2;
			oDetail.height =	Math.round( oSizeParent.height / _oSizeItem.height)  * _oSizeItem.height + 12;

			oEvent = new CustomEvent( 'stopresize', { detail : oDetail});
			_oOption.parent.dispatchEvent( oEvent);
		}

		/**
		 * [_initSize description]
		 * @return {[type]} [description]
		 */
		function _initSize(){
			var oSize     = _oOption.parent.getBoundingClientRect(),
					items     = [].slice.apply( _oOption.parent.querySelectorAll('*')),
				 oSizeItem = items[ 0 ].getBoundingClientRect();

			_oOption.parent.style.width  =  oSize.width + "px";
			_oOption.parent.style.height =  oSize.height + "px";

			_oSizeItem.width  = oSizeItem.width;
			_oSizeItem.height = oSizeItem.height;
		}

		/**
		 * [_getCurrentSize description]
		 * @return {[type]} [description]
		 */
		function _getCurrentSize( el){

			return {
								width  : parseInt( el.style.width),
								height : parseInt( el.style.height)
							};
		}

		/**
		 * [_getSize description]
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		function _getSize( e){

			var oDetail = {
											width  : 0,
											height : 0
										},
					oEvent  = null,
					oSize   = null,
					iValue  = 0;

			oDetail = _getCurrentSize( _oOption.parent );
			oSize   = e.delegateTarget.getBoundingClientRect();

			switch ( e.delegateTarget) {
				case _oOption.poignets[ 0 ]:
					iValue = e.clientX - ( oSize.left + ( oSize.width / 2));
					oDetail.width  += Math.ceil( iValue);
					break;

				case _oOption.poignets[ 1 ]:
					iValue = e.clientY - ( oSize.top + ( oSize.height / 2));
					oDetail.height += Math.ceil( iValue);
					break;

				default:
					break;
			}

			oEvent = new CustomEvent( 'resize', { detail : oDetail});
			_oOption.parent.dispatchEvent( oEvent);
		}

		/**
		 * [_updateSize description]
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		function _updateSize( e){

					if( e.detail.width)
						this.style.width  =  e.detail.width + "px";

					if( e.detail.height)
						this.style.height =  e.detail.height + "px";

		}

		/**
		 * [_actionHandler description]
		 * @return {[type]} [description]
		 */
		function _actionHandler(){
			var i = 0;

			_oOption.parent.addEventListener('resize', _updateSize);
			_oOption.parent.addEventListener('stopresize', _updateSize);

			_delegateClose  = _delegate( _oOption.poignets,  _closeResize);
			_delegateResize = _delegate( _oOption.poignets,  _openResize);

			doc.body.addEventListener( 'mouseup', _delegateClose);

			for(; i < _oOption.poignets.length ; i++){
				if(_oOption.poignets[ i ])
					_oOption.poignets[ i ].addEventListener( 'mouseleave', _delegateClose);
			}

			doc.body.addEventListener( 'mousedown', _delegateResize);



		}

		_init( oParam);

		return {};

	};

	global.Resize = Resize;


})(document, window);
