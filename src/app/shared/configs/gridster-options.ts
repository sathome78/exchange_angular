
/** options for dashboard gridster container */
export const gridsterOptions = {
  // core configuration is default one - for smallest view. It has hidden minWidth: 0.
  lanes: 3, // amount of lanes (cells) in the grid
  direction: 'vertical', // floating top - vertical, left - horizontal
  floating: true,
  dragAndDrop: true, // enable/disable drag and drop for all items in grid
  resizable: false, // enable/disable resizing by drag and drop for all items in grid
  resizeHandles: {
    s: true,
    e: true,
    se: true,
    sw: true,
    w: true,
  },
    // widthHeightRatio: .97
    widthHeightRatio: .78
  , // proportion between item width and height
  lines: {
    visible: false,
    color: '#9f7f6d',
    width: 1
  },
  shrink: true,
  useCSSTransforms: true,
  responsiveView: true, // turn on adopting items sizes on window resize and enable responsiveOptions
  responsiveDebounce: 500, // window resize debounce time
  responsiveSizes: true,
  // List of different gridster configurations for different breakpoints.
  // Each breakpoint is defined by name stored in "breakpoint" property. There is fixed set of breakpoints
  // available to use with default minWidth assign to each.
  // - sm: 576 - Small devices
  // - md: 768 - Medium devices
  // - lg: 992 - Large devices
  // - xl: 1200 - Extra large
  // MinWidth for each breakpoint can be overwritten like it's visible below.
  // ResponsiveOptions can overwrite default configuration with any option available.
  responsiveOptions: [
    {
      breakpoint: 'md',
      minWidth: 768,
      minHeight: 500,
      widthHeightRatio: 0.5,
    },
    {
      breakpoint: 'lg',
      minWidth: 1180,
      minHeight: 500,
      celWidth: '30px'
    }
  ]
};

/** size limits for all dashboard gidster items */
export const gridsterItemOptions = {
  minWidth: 1,
  minHeight: 1,
  maxWidth: 3,
  maxHeight: 2
};
