import React, { useCallback, useState } from 'react'
import cm from '@classmatejs/react'

import FlexGraphicBlocks from './Blocks'
import Legend from './Legend'
import useFlexGraphicInteractions from './useFlexGraphicInteractions'
import {
  EXTENSION_BLOCK_CONNECTED_HOOKS,
  EXTENSION_BLOCK_KEYS,
  type ExtensionBlockVariants,
  FlexGraphicHook,
  HOOK_COLORS,
} from '../../../util/constants'

const StyledOuter = cm.div`
  w-full md:w-3/4 lg:w-4/5 
  relative
`

const pinHeight = 2
const pinWidth = 12
const strokeWidth = 3

const FlexGraphic = () => {
  const {
    onRenderClientRef,
    wrapperRef,
    onCreatePageContextRef,
    headRef,
    onHookCallRef,
    onBeforeRenderHtmlRef,
    onCreateGlobalContextRef,
    onErrorRef,
    onRenderHtmlRef,
    onAfterRenderHtmlRef,
    onBeforeRenderClientRef,
    onChangeHightlight,
    activeHooks,
    isSlideshowMode,
  } = useFlexGraphicInteractions()
  const [activeBlocks, setActiveBlocks] = useState<ExtensionBlockVariants[] | null>(null)

  const getHoverHandlers = useCallback(
    (hookName: FlexGraphicHook) => ({
      onMouseEnter: () => onChangeHightlight([hookName]),
      onMouseLeave: () => onChangeHightlight(null),
    }),
    [onChangeHightlight],
  )

  const getBlocksForHooks = useCallback((hooks: FlexGraphicHook[]) => {
    if (!hooks.length) {
      return []
    }
    return EXTENSION_BLOCK_KEYS.filter((block) =>
      EXTENSION_BLOCK_CONNECTED_HOOKS[block].some((hook) => hooks.includes(hook)),
    )
  }, [])

  const onBlockHover = useCallback(
    (block: ExtensionBlockVariants) => {
      const hooks = EXTENSION_BLOCK_CONNECTED_HOOKS[block]
      setActiveBlocks(hooks.length ? getBlocksForHooks(hooks) : [block])
      onChangeHightlight(hooks)
    },
    [getBlocksForHooks, onChangeHightlight],
  )

  const onBlockLeave = useCallback(() => {
    setActiveBlocks(null)
    onChangeHightlight(null)
  }, [onChangeHightlight])

  return (
    <>
      <Legend activeHooks={activeHooks} onChangeHightlight={onChangeHightlight} isSlideshowMode={isSlideshowMode} />
      <StyledOuter>
        <FlexGraphicBlocks
          activeHooks={activeHooks}
          activeBlocks={activeBlocks}
          onBlockHover={onBlockHover}
          onBlockLeave={onBlockLeave}
        />
        <svg
          className="w-full h-auto "
          width="479"
          height="349"
          viewBox="0 0 479 349"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* onRenderClient */}
          <g ref={onRenderClientRef} {...getHoverHandlers('onRenderClient')}>
            <rect fill={HOOK_COLORS.onRenderClient} width={pinWidth} height={pinHeight} x="70" y="208" />
            <path stroke={HOOK_COLORS.onRenderClient} strokeWidth={strokeWidth} d="M76 130V210" />
            {/* outwards circuit */}
            <g>
              <path
                stroke={HOOK_COLORS.onRenderClient}
                strokeWidth={strokeWidth}
                d="M4.5 165.5C6.15685 165.5 7.5 166.843 7.5 168.5C7.5 170.157 6.15685 171.5 4.5 171.5C2.84314 171.5 1.5 170.157 1.5 168.5C1.5 166.843 2.84315 165.5 4.5 165.5Z"
              />
              <path stroke={HOOK_COLORS.onRenderClient} strokeWidth={strokeWidth} d="M75 168.5L7.77758 168.5" />
            </g>
          </g>

          {/* onRenderHtml */}
          <g ref={onRenderHtmlRef} {...getHoverHandlers('onRenderHtml')}>
            <path stroke={HOOK_COLORS.onRenderHtml} strokeWidth={strokeWidth} d="M96 130V210" />
            <rect fill={HOOK_COLORS.onRenderHtml} x="90" y="208" width={pinWidth} height={pinHeight} />
          </g>

          {/* onAfterRenderHtml */}
          <g ref={onAfterRenderHtmlRef} {...getHoverHandlers('onAfterRenderHtml')}>
            <rect fill={HOOK_COLORS.onAfterRenderHtml} x="150" y="130" width={pinWidth} height={pinHeight} />
            <path
              stroke={HOOK_COLORS.onAfterRenderHtml}
              strokeWidth={strokeWidth}
              d="M296 182V176.828C296 176.298 295.789 175.789 295.414 175.414L278.586 158.586C278.211 158.211 277.702 158 277.172 158H179.315C178.793 158 178.291 157.795 177.917 157.43L156.602 136.588C156.217 136.212 156 135.697 156 135.158V130"
            />
            <path
              stroke={HOOK_COLORS.onAfterRenderHtml}
              strokeWidth={strokeWidth}
              d="M236 158L247.414 146.586C247.789 146.211 248 145.702 248 145.172L248 102.828C248 102.298 248.211 101.789 248.586 101.414L251.414 98.5858C251.789 98.2107 252.298 98 252.828 98L271.102 98C271.673 98 272.217 98.2443 272.597 98.6713L275.495 101.932C275.82 102.298 276 102.771 276 103.26L276 108"
            />
          </g>

          {/* onBeforeRenderHtml */}
          <g ref={onBeforeRenderHtmlRef} {...getHoverHandlers('onBeforeRenderHtml')}>
            <rect fill={HOOK_COLORS.onBeforeRenderHtml} x="170" y="130" width={pinWidth} height={pinHeight} />
            <path
              stroke={HOOK_COLORS.onBeforeRenderHtml}
              strokeWidth={strokeWidth}
              d="M296 108V102.828C296 102.298 295.789 101.789 295.414 101.414L286.586 92.5858C286.211 92.2107 285.702 92 285.172 92H250.828C250.298 92 249.789 92.2107 249.414 92.5858L242.586 99.4142C242.211 99.7893 242 100.298 242 100.828V143.172C242 143.702 241.789 144.211 241.414 144.586L234.586 151.414C234.211 151.789 233.702 152 233.172 152H192.828C192.298 152 191.789 151.789 191.414 151.414L176.586 136.586C176.211 136.211 176 135.702 176 135.172V130"
            />
          </g>

          {/* Wrapper */}
          <g ref={wrapperRef} {...getHoverHandlers('Wrapper')}>
            <rect fill={HOOK_COLORS.Wrapper} x="190" y="130" width={pinWidth} height={pinHeight} />
            <path
              stroke={HOOK_COLORS.Wrapper}
              strokeWidth={strokeWidth}
              d="M300 86.5L315.392 101.411C315.78 101.787 316 102.306 316 102.847V108"
            />
            <path
              stroke={HOOK_COLORS.Wrapper}
              strokeWidth={strokeWidth}
              d="M268 86.5L275.317 80.0976C275.751 79.7178 276 79.1692 276 78.5925V73"
            />
            <line stroke={HOOK_COLORS.Wrapper} strokeWidth={strokeWidth} x1="471" y1="159.73" x2="444" y2="159.73" />
            <path stroke={HOOK_COLORS.Wrapper} strokeWidth={strokeWidth} d="M242.5 92L242.5 8.07816" />
            <path
              stroke={HOOK_COLORS.Wrapper}
              strokeWidth={strokeWidth}
              d="M474.5 156.73C476.157 156.73 477.5 158.074 477.5 159.73C477.5 161.387 476.157 162.73 474.5 162.73C472.843 162.73 471.5 161.387 471.5 159.73C471.5 158.074 472.843 156.73 474.5 156.73Z"
            />
            <path
              stroke={HOOK_COLORS.Wrapper}
              strokeWidth={strokeWidth}
              d="M245.5 4.5C245.5 6.15685 244.157 7.5 242.5 7.5C240.843 7.5 239.5 6.15685 239.5 4.5C239.5 2.84315 240.843 1.5 242.5 1.5C244.157 1.5 245.5 2.84315 245.5 4.5Z"
            />
            <path
              stroke={HOOK_COLORS.Wrapper}
              strokeWidth={strokeWidth}
              d="M396 182V174.828C396 174.298 396.211 173.789 396.586 173.414L403.414 166.586C403.789 166.211 404.298 166 404.828 166H439.102C439.673 166 440.217 165.756 440.597 165.329L443.495 162.068C443.82 161.702 444 161.229 444 160.74V93.9133C444 93.3332 443.748 92.7818 443.31 92.4019L437.064 86.9886C436.7 86.6735 436.235 86.5 435.754 86.5L288.5 86.5H248.778C248.278 86.5 247.795 86.6876 247.427 87.0257L236.649 96.9055C236.235 97.2843 236 97.8192 236 98.3798V141.172C236 141.702 235.789 142.211 235.414 142.586L232.586 145.414C232.211 145.789 231.702 146 231.172 146H205C204.37 146 203.778 145.704 203.4 145.2L196.9 136.533C196.64 136.187 196.5 135.766 196.5 135.333V130"
            />
          </g>

          {/* onError */}
          <g ref={onErrorRef} {...getHoverHandlers('onError')}>
            <rect fill={HOOK_COLORS.onError} x="150" y="208" width={pinWidth} height={pinHeight} />
            <path
              stroke={HOOK_COLORS.onError}
              strokeWidth={strokeWidth}
              d="M156 210V204.828C156 204.298 156.211 203.789 156.586 203.414L177.414 182.586C177.789 182.211 178.298 182 178.828 182H219.172C219.702 182 220.211 182.211 220.586 182.586L235.414 197.414C235.789 197.789 236 198.298 236 198.828V225.172C236 225.702 236.211 226.211 236.586 226.586L253.414 243.414C253.789 243.789 254.298 244 254.828 244H285.172C285.702 244 286.211 244.211 286.586 244.586L295.414 253.414C295.789 253.789 296 254.298 296 254.828V260"
            />
          </g>

          {/* onCreateGlobalContext */}
          <g ref={onCreateGlobalContextRef} {...getHoverHandlers('onCreateGlobalContext')}>
            <rect fill={HOOK_COLORS.onCreateGlobalContext} x="130" y="208" width={pinWidth} height={pinHeight} />
            <path
              stroke={HOOK_COLORS.onCreateGlobalContext}
              strokeWidth={strokeWidth}
              d="M136 210V204.828C136 204.298 136.211 203.789 136.586 203.414L163.414 176.586C163.789 176.211 164.298 176 164.828 176H221.172C221.702 176 222.211 176.211 222.586 176.586L241.414 195.414C241.789 195.789 242 196.298 242 196.828V223.172C242 223.702 242.211 224.211 242.586 224.586L255.414 237.414C255.789 237.789 256.298 238 256.828 238H299.172C299.702 238 300.211 238.211 300.586 238.586L315.414 253.414C315.789 253.789 316 254.298 316 254.828V260"
            />
          </g>

          {/* Head */}
          <g ref={headRef} {...getHoverHandlers('Head')}>
            <rect fill={HOOK_COLORS.Head} x="110" y="130" width={pinWidth} height={pinHeight} />
            <path
              stroke={HOOK_COLORS.Head}
              strokeWidth={strokeWidth}
              d="M116 130V135.172C116 135.702 116.211 136.211 116.586 136.586L149.414 169.414C149.789 169.789 150.298 170 150.828 170H223.659C224.197 170 224.712 170.217 225.088 170.601L247.429 193.417C247.795 193.791 248 194.293 248 194.816V221.172C248 221.702 248.211 222.211 248.586 222.586L257.415 231.414C257.79 231.789 258.299 232 258.829 232H313.172C313.702 232 314.211 232.211 314.586 232.586L335.415 253.414C335.79 253.789 336.001 254.298 336.001 254.828V260"
            />
          </g>

          {/* onHookCall */}
          <g ref={onHookCallRef} {...getHoverHandlers('onHookCall')}>
            <rect fill={HOOK_COLORS.onHookCall} x="170" y="208" width={pinWidth} height={pinHeight} />
            <path
              stroke={HOOK_COLORS.onHookCall}
              strokeWidth={strokeWidth}
              d="M176 209.5V204.828C176 204.298 176.211 203.789 176.586 203.414L191.414 188.586C191.789 188.211 192.298 188 192.828 188H216.695C217.212 188 217.708 188.2 218.08 188.557L229.385 199.41C229.778 199.787 230 200.308 230 200.852V227.172C230 227.702 230.211 228.211 230.586 228.586L251.414 249.414C251.789 249.789 252.298 250 252.828 250H271.172C271.702 250 272.211 250.211 272.586 250.586L275.414 253.414C275.789 253.789 276 254.298 276 254.828V260"
            />
          </g>

          {/* onBeforeRenderClient */}
          <g ref={onBeforeRenderClientRef} {...getHoverHandlers('onBeforeRenderClient')}>
            <rect fill={HOOK_COLORS.onBeforeRenderClient} x="130" y="130" width={pinWidth} height={pinHeight} />
            <path
              stroke={HOOK_COLORS.onBeforeRenderClient}
              strokeWidth={strokeWidth}
              d="M136 130V135.172C136 135.702 136.211 136.211 136.586 136.586L163.414 163.414C163.789 163.789 164.298 164 164.828 164H228H244H263.172C263.702 164 264.211 164.211 264.586 164.586L275.414 175.414C275.789 175.789 276 176.298 276 176.828V182"
            />
          </g>

          {/* onCreatePageContext */}
          <g ref={onCreatePageContextRef} {...getHoverHandlers('onCreatePageContext')}>
            <rect fill={HOOK_COLORS.onCreatePageContext} x="190" y="208" width={pinWidth} height={pinHeight} />
            <path
              stroke={HOOK_COLORS.onCreatePageContext}
              strokeWidth={strokeWidth}
              d="M196 210V204.828C196 204.298 196.211 203.789 196.586 203.414L205.414 194.586C205.789 194.211 206.298 194 206.828 194H215.172C215.702 194 216.211 194.211 216.586 194.586L223.414 201.414C223.789 201.789 224 202.298 224 202.828V229.184C224 229.707 224.205 230.209 224.571 230.583L247.429 253.917C247.795 254.291 248 254.793 248 255.316V305.102C248 305.673 248.244 306.217 248.671 306.597L251.932 309.495C252.298 309.82 252.771 310 253.26 310H439.172C439.702 310 440.211 309.789 440.586 309.414L443.414 306.586C443.789 306.211 444 305.702 444 305.172V176.828C444 176.298 443.789 175.789 443.414 175.414L440.586 172.586C440.211 172.211 439.702 172 439.172 172H420.828C420.298 172 419.789 172.211 419.414 172.586L416.586 175.414C416.211 175.789 416 176.298 416 176.828V182"
            />
            <path
              stroke={HOOK_COLORS.onCreatePageContext}
              strokeWidth={strokeWidth}
              d="M232.5 344.5C232.5 342.843 233.843 341.5 235.5 341.5C237.157 341.5 238.5 342.843 238.5 344.5C238.5 346.157 237.157 347.5 235.5 347.5C233.843 347.5 232.5 346.157 232.5 344.5Z"
            />
            <path stroke={HOOK_COLORS.onCreatePageContext} strokeWidth={strokeWidth} d="M235.5 241L235.5 341.197" />
          </g>
        </svg>
      </StyledOuter>
    </>
  )
}

export default FlexGraphic
