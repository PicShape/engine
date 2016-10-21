
// Validation Scheme for /convert
exports.convertSchema = {
 'iter': {
    optional: true,

    in: 'body',
    notEmpty: true,
    isInt: {
      options: [{ min: 1, max: 500 }],
      errorMessage: 'Invalid iteration amount [1 ; 500]'
    },
    errorMessage: 'iter must be an integer.'
  },
  'mode': {
      optional: true,

      in: 'body',
      notEmpty: true,
      isInt: {
        options: [{ min: 0, max: 8 }],
        errorMessage: 'Invalid mode number'
      }
  },
 'format': {
     optional: true,
     matches: {
         options: ['(png|jpg|svg)$','i'],
         errorMessage: 'Correct values for format are either png, jpg or svg.',
     },
     in: 'body',
     notEmpty: true,
 }

};
