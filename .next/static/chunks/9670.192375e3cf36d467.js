(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9670],{6195:function(e,t,n){"use strict";let r,i;n.d(t,{x:function(){return T}});var o=n(7445),a=n(8152),s=n(444),l=n(9163);let c=new s.Box3,u=new s.Vector3;class d extends s.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new s.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new s.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new s.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new s.InterleavedBufferAttribute(n,3,0)),this.setAttribute("instanceEnd",new s.InterleavedBufferAttribute(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new s.InstancedInterleavedBuffer(n,2*t,1);return this.setAttribute("instanceColorStart",new s.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new s.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new s.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new s.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new s.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,o=e.count;i<o;i++)u.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(u)),u.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(u));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=n(3247);class p extends s.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:s.UniformsUtils.clone(s.UniformsUtils.merge([s.UniformsLib.common,s.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new s.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${f.i>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let m=f.i>=125?"uv1":"uv2",h=new s.Vector4,v=new s.Vector3,y=new s.Vector3,g=new s.Vector4,x=new s.Vector4,w=new s.Vector4,S=new s.Vector3,b=new s.Matrix4,E=new s.Line3,A=new s.Vector3,_=new s.Box3,M=new s.Sphere,L=new s.Vector4;function z(e,t,n){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=i/n.width,L.y=i/n.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class P extends s.Mesh{constructor(e=new d,t=new p({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,o=t.count;e<o;e++,i+=2)v.fromBufferAttribute(t,e),y.fromBufferAttribute(n,e),r[i]=0===i?0:r[i-1],r[i+1]=r[i]+v.distanceTo(y);let i=new s.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new s.InterleavedBufferAttribute(i,1,0)),e.setAttribute("instanceDistanceEnd",new s.InterleavedBufferAttribute(i,1,1)),this}raycast(e,t){let n,o;let a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;r=e.ray;let u=this.matrixWorld,d=this.geometry,f=this.material;if(i=f.linewidth+c,null===d.boundingSphere&&d.computeBoundingSphere(),M.copy(d.boundingSphere).applyMatrix4(u),a)n=.5*i;else{let e=Math.max(l.near,M.distanceToPoint(r.origin));n=z(l,e,f.resolution)}if(M.radius+=n,!1!==r.intersectsSphere(M)){if(null===d.boundingBox&&d.computeBoundingBox(),_.copy(d.boundingBox).applyMatrix4(u),a)o=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(r.origin));o=z(l,e,f.resolution)}_.expandByScalar(o),!1!==r.intersectsBox(_)&&(a?function(e,t){let n=e.matrixWorld,o=e.geometry,a=o.attributes.instanceStart,l=o.attributes.instanceEnd,c=Math.min(o.instanceCount,a.count);for(let o=0;o<c;o++){E.start.fromBufferAttribute(a,o),E.end.fromBufferAttribute(l,o),E.applyMatrix4(n);let c=new s.Vector3,u=new s.Vector3;r.distanceSqToSegment(E.start,E.end,u,c),u.distanceTo(c)<.5*i&&t.push({point:u,pointOnLine:c,distance:r.origin.distanceTo(u),object:e,face:null,faceIndex:o,uv:null,[m]:null})}}(this,t):function(e,t,n){let o=t.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,u=c.attributes.instanceStart,d=c.attributes.instanceEnd,f=Math.min(c.instanceCount,u.count),p=-t.near;r.at(1,w),w.w=1,w.applyMatrix4(t.matrixWorldInverse),w.applyMatrix4(o),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,S.copy(w),b.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<f;t++){if(g.fromBufferAttribute(u,t),x.fromBufferAttribute(d,t),g.w=1,x.w=1,g.applyMatrix4(b),x.applyMatrix4(b),g.z>p&&x.z>p)continue;if(g.z>p){let e=g.z-x.z,t=(g.z-p)/e;g.lerp(x,t)}else if(x.z>p){let e=x.z-g.z,t=(x.z-p)/e;x.lerp(g,t)}g.applyMatrix4(o),x.applyMatrix4(o),g.multiplyScalar(1/g.w),x.multiplyScalar(1/x.w),g.x*=a.x/2,g.y*=a.y/2,x.x*=a.x/2,x.y*=a.y/2,E.start.copy(g),E.start.z=0,E.end.copy(x),E.end.z=0;let c=E.closestPointToPointParameter(S,!0);E.at(c,A);let f=s.MathUtils.lerp(g.z,x.z,c),h=f>=-1&&f<=1,v=S.distanceTo(A)<.5*i;if(h&&v){E.start.fromBufferAttribute(u,t),E.end.fromBufferAttribute(d,t),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new s.Vector3,o=new s.Vector3;r.distanceSqToSegment(E.start,E.end,o,i),n.push({point:o,pointOnLine:i,distance:r.origin.distanceTo(o),object:e,face:null,faceIndex:t,uv:null,[m]:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(h),this.material.uniforms.resolution.value.set(h.z,h.w))}}class U extends d{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(3===t)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class C extends P{constructor(e=new U,t=new p({color:16777215*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let T=a.forwardRef(function(e,t){var n;let{points:r,color:i=16777215,vertexColors:c,linewidth:u,lineWidth:f,segments:m,dashed:h,...v}=e,y=(0,l.A)(e=>e.size),g=a.useMemo(()=>m?new P:new C,[m]),[x]=a.useState(()=>new p),w=(null==c||null==(n=c[0])?void 0:n.length)===4?4:3,S=a.useMemo(()=>{let e=m?new d:new U,t=r.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(e.setPositions(t.flat()),c){i=16777215;let t=c.map(e=>e instanceof s.Color?e.toArray():e);e.setColors(t.flat(),w)}return e},[r,m,c,w]);return a.useLayoutEffect(()=>{g.computeLineDistances()},[r,g]),a.useLayoutEffect(()=>{h?x.defines.USE_DASH="":delete x.defines.USE_DASH,x.needsUpdate=!0},[h,x]),a.useEffect(()=>()=>S.dispose(),[S]),a.createElement("primitive",(0,o.Z)({object:g,ref:t},v),a.createElement("primitive",{object:S,attach:"geometry"}),a.createElement("primitive",(0,o.Z)({object:x,attach:"material",color:i,vertexColors:!!c,resolution:[y.width,y.height],linewidth:null!=u?u:f,dashed:h,transparent:4===w},v)))})},3193:function(e,t,n){"use strict";n.d(t,{t:function(){return c}});var r=n(8152),i=n(9163),o=n(444);let a=parseInt(o.REVISION.replace(/\D+/g,""));class s extends o.ShaderMaterial{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:"\n      uniform float time;\n      attribute float size;\n      varying vec3 vColor;\n      void main() {\n        vColor = color;\n        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);\n        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));\n        gl_Position = projectionMatrix * mvPosition;\n      }",fragmentShader:"\n      uniform sampler2D pointTexture;\n      uniform float fade;\n      varying vec3 vColor;\n      void main() {\n        float opacity = 1.0;\n        if (fade == 1.0) {\n          float d = distance(gl_PointCoord, vec2(0.5, 0.5));\n          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));\n        }\n        gl_FragColor = vec4(vColor, opacity);\n\n        #include <tonemapping_fragment>\n	      #include <".concat(a>=154?"colorspace_fragment":"encodings_fragment",">\n      }")})}}let l=e=>new o.Vector3().setFromSpherical(new o.Spherical(e,Math.acos(1-2*Math.random()),2*Math.random()*Math.PI)),c=r.forwardRef((e,t)=>{let{radius:n=100,depth:a=50,count:c=5e3,saturation:u=0,factor:d=4,fade:f=!1,speed:p=1}=e,m=r.useRef(),[h,v,y]=r.useMemo(()=>{let e=[],t=[],r=Array.from({length:c},()=>(.5+.5*Math.random())*d),i=new o.Color,s=n+a,f=a/c;for(let n=0;n<c;n++)s-=f*Math.random(),e.push(...l(s).toArray()),i.setHSL(n/c,u,.9),t.push(i.r,i.g,i.b);return[new Float32Array(e),new Float32Array(t),new Float32Array(r)]},[c,a,d,n,u]);(0,i.C)(e=>m.current&&(m.current.uniforms.time.value=e.clock.getElapsedTime()*p));let[g]=r.useState(()=>new s);return r.createElement("points",{ref:t},r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[h,3]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[v,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[y,1]})),r.createElement("primitive",{ref:m,object:g,attach:"material",blending:o.AdditiveBlending,"uniforms-fade-value":f,depthWrite:!1,transparent:!0,vertexColors:!0}))})},2262:function(e,t,n){"use strict";let r,i;n.d(t,{V:function(){return x}});var o=n(7445),a=n(8152),s=n(5707),l=n(444),c=n(9163);let u=new l.Vector3,d=new l.Vector3,f=new l.Vector3,p=new l.Vector2;function m(e,t,n){let r=u.setFromMatrixPosition(e.matrixWorld);r.project(t);let i=n.width/2,o=n.height/2;return[r.x*i+i,-(r.y*o)+o]}let h=e=>1e-10>Math.abs(e)?0:e;function v(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",r="matrix3d(";for(let n=0;16!==n;n++)r+=h(t[n]*e.elements[n])+(15!==n?",":")");return n+r}let y=(r=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>v(e,r)),g=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>v(e,i(t),"translate(-50%,-50%)")),x=a.forwardRef((e,t)=>{let{children:n,eps:r=.001,style:i,className:v,prepend:x,center:w,fullscreen:S,portal:b,distanceFactor:E,sprite:A=!1,transform:_=!1,occlude:M,onOcclude:L,castShadow:z,receiveShadow:P,material:U,geometry:C,zIndexRange:T=[16777271,0],calculatePosition:B=m,as:O="div",wrapperClass:D,pointerEvents:I="auto",...R}=e,{gl:V,camera:W,scene:j,size:H,raycaster:F,events:N,viewport:G}=(0,c.A)(),[k]=a.useState(()=>document.createElement(O)),q=a.useRef(),Z=a.useRef(null),J=a.useRef(0),X=a.useRef([0,0]),$=a.useRef(null),K=a.useRef(null),Q=(null==b?void 0:b.current)||N.connected||V.domElement.parentNode,Y=a.useRef(null),ee=a.useRef(!1),et=a.useMemo(()=>{var e;return M&&"blending"!==M||Array.isArray(M)&&M.length&&(e=M[0])&&"object"==typeof e&&"current"in e},[M]);a.useLayoutEffect(()=>{let e=V.domElement;M&&"blending"===M?(e.style.zIndex="".concat(Math.floor(T[0]/2)),e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[M]),a.useLayoutEffect(()=>{if(Z.current){let e=q.current=s.createRoot(k);if(j.updateMatrixWorld(),_)k.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=B(Z.current,W,H);k.style.cssText="position:absolute;top:0;left:0;transform:translate3d(".concat(e[0],"px,").concat(e[1],"px,0);transform-origin:0 0;")}return Q&&(x?Q.prepend(k):Q.appendChild(k)),()=>{Q&&Q.removeChild(k),e.unmount()}}},[Q,_]),a.useLayoutEffect(()=>{D&&(k.className=D)},[D]);let en=a.useMemo(()=>_?{position:"absolute",top:0,left:0,width:H.width,height:H.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:w?"translate3d(-50%,-50%,0)":"none",...S&&{top:-H.height/2,left:-H.width/2,width:H.width,height:H.height},...i},[i,w,S,H,_]),er=a.useMemo(()=>({position:"absolute",pointerEvents:I}),[I]);a.useLayoutEffect(()=>{var e,r;ee.current=!1,_?null==(e=q.current)||e.render(a.createElement("div",{ref:$,style:en},a.createElement("div",{ref:K,style:er},a.createElement("div",{ref:t,className:v,style:i,children:n})))):null==(r=q.current)||r.render(a.createElement("div",{ref:t,style:en,className:v,children:n}))});let ei=a.useRef(!0);(0,c.C)(e=>{if(Z.current){W.updateMatrixWorld(),Z.current.updateWorldMatrix(!0,!1);let e=_?X.current:B(Z.current,W,H);if(_||Math.abs(J.current-W.zoom)>r||Math.abs(X.current[0]-e[0])>r||Math.abs(X.current[1]-e[1])>r){let t=function(e,t){let n=u.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld),i=n.sub(r),o=t.getWorldDirection(f);return i.angleTo(o)>Math.PI/2}(Z.current,W),n=!1;et&&(Array.isArray(M)?n=M.map(e=>e.current):"blending"!==M&&(n=[j]));let r=ei.current;if(n){let e=function(e,t,n,r){let i=u.setFromMatrixPosition(e.matrixWorld),o=i.clone();o.project(t),p.set(o.x,o.y),n.setFromCamera(p,t);let a=n.intersectObjects(r,!0);if(a.length){let e=a[0].distance;return i.distanceTo(n.ray.origin)<e}return!0}(Z.current,W,F,n);ei.current=e&&!t}else ei.current=!t;r!==ei.current&&(L?L(!ei.current):k.style.display=ei.current?"block":"none");let i=Math.floor(T[0]/2),o=M?et?[T[0],i]:[i-1,0]:T;if(k.style.zIndex="".concat(function(e,t,n){if(t instanceof l.PerspectiveCamera||t instanceof l.OrthographicCamera){let r=u.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld),o=r.distanceTo(i),a=(n[1]-n[0])/(t.far-t.near),s=n[1]-a*t.far;return Math.round(a*o+s)}}(Z.current,W,o)),_){let[e,t]=[H.width/2,H.height/2],n=W.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:i,left:o,bottom:a,right:s}=W,l=y(W.matrixWorldInverse),c=r?"scale(".concat(n,")translate(").concat(h(-(s+o)/2),"px,").concat(h((i+a)/2),"px)"):"translateZ(".concat(n,"px)"),u=Z.current.matrixWorld;A&&((u=W.matrixWorldInverse.clone().transpose().copyPosition(u).scale(Z.current.scale)).elements[3]=u.elements[7]=u.elements[11]=0,u.elements[15]=1),k.style.width=H.width+"px",k.style.height=H.height+"px",k.style.perspective=r?"":"".concat(n,"px"),$.current&&K.current&&($.current.style.transform="".concat(c).concat(l,"translate(").concat(e,"px,").concat(t,"px)"),K.current.style.transform=g(u,1/((E||10)/400)))}else{let t=void 0===E?1:function(e,t){if(t instanceof l.OrthographicCamera)return t.zoom;if(!(t instanceof l.PerspectiveCamera))return 1;{let n=u.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*n.distanceTo(r))}}(Z.current,W)*E;k.style.transform="translate3d(".concat(e[0],"px,").concat(e[1],"px,0) scale(").concat(t,")")}X.current=e,J.current=W.zoom}}if(!et&&Y.current&&!ee.current){if(_){if($.current){let e=$.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=W;if(t||C)R.scale&&(Array.isArray(R.scale)?R.scale instanceof l.Vector3?Y.current.scale.copy(R.scale.clone().divideScalar(1)):Y.current.scale.set(1/R.scale[0],1/R.scale[1],1/R.scale[2]):Y.current.scale.setScalar(1/R.scale));else{let t=(E||10)/400,n=e.clientWidth*t,r=e.clientHeight*t;Y.current.scale.set(n,r,1)}ee.current=!0}}}else{let t=k.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/G.factor,n=t.clientWidth*e,r=t.clientHeight*e;Y.current.scale.set(n,r,1),ee.current=!0}Y.current.lookAt(e.camera.position)}}});let eo=a.useMemo(()=>({vertexShader:_?void 0:'\n          /*\n            This shader is from the THREE\'s SpriteMaterial.\n            We need to turn the backing plane into a Sprite\n            (make it always face the camera) if "transfrom"\n            is false.\n          */\n          #include <common>\n\n          void main() {\n            vec2 center = vec2(0., 1.);\n            float rotation = 0.0;\n\n            // This is somewhat arbitrary, but it seems to work well\n            // Need to figure out how to derive this dynamically if it even matters\n            float size = 0.03;\n\n            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\n            vec2 scale;\n            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );\n            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );\n\n            bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n            if ( isPerspective ) scale *= - mvPosition.z;\n\n            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;\n            vec2 rotatedPosition;\n            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n            mvPosition.xy += rotatedPosition;\n\n            gl_Position = projectionMatrix * mvPosition;\n          }\n      ',fragmentShader:"\n        void main() {\n          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n        }\n      "}),[_]);return a.createElement("group",(0,o.Z)({},R,{ref:Z}),M&&!et&&a.createElement("mesh",{castShadow:z,receiveShadow:P,ref:Y},C||a.createElement("planeGeometry",null),U||a.createElement("shaderMaterial",{side:l.DoubleSide,vertexShader:eo.vertexShader,fragmentShader:eo.fragmentShader})))})},9334:function(e,t,n){"use strict";var r,i;e.exports=(null==(r=n.g.process)?void 0:r.env)&&"object"==typeof(null==(i=n.g.process)?void 0:i.env)?n.g.process:n(273)},273:function(e){!function(){var t={229:function(e){var t,n,r,i=e.exports={};function o(){throw Error("setTimeout has not been defined")}function a(){throw Error("clearTimeout has not been defined")}function s(e){if(t===setTimeout)return setTimeout(e,0);if((t===o||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:o}catch(e){t=o}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(e){n=a}}();var l=[],c=!1,u=-1;function d(){c&&r&&(c=!1,r.length?l=r.concat(l):u=-1,l.length&&f())}function f(){if(!c){var e=s(d);c=!0;for(var t=l.length;t;){for(r=l,l=[];++u<t;)r&&r[u].run();u=-1,t=l.length}r=null,c=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function m(){}i.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];l.push(new p(e,t)),1!==l.length||c||s(f)},p.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=m,i.addListener=m,i.once=m,i.off=m,i.removeListener=m,i.removeAllListeners=m,i.emit=m,i.prependListener=m,i.prependOnceListener=m,i.listeners=function(e){return[]},i.binding=function(e){throw Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw Error("process.chdir is not supported")},i.umask=function(){return 0}}},n={};function r(e){var i=n[e];if(void 0!==i)return i.exports;var o=n[e]={exports:{}},a=!0;try{t[e](o,o.exports,r),a=!1}finally{a&&delete n[e]}return o.exports}r.ab="//";var i=r(229);e.exports=i}()},3247:function(e,t,n){"use strict";n.d(t,{i:function(){return r}});let r=parseInt(n(444).REVISION.replace(/\D+/g,""))}}]);