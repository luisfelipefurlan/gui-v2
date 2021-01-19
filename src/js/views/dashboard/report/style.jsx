import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    btnReport: {
      paddingLeft: 20,
      paddingRight: 20,
      height: 40,
    },
    width400: {
      width: '380px !important',
    },
    boxReport: {
      paddingLeft: 20,
      display: 'flex',
      flexWrap: 'wrap',
      overflow: 'hidden',
      width: '128px',
      transition: 'width 0.5s',
      paddingRight: 20,
      height: '40px',
      borderRadius: '6px',
    },
    textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
      width: 179,
      '& label.Mui-focused': {
        color: 'white',
      },
      '& label': {
        color: 'white',
      },
      '& .MuiIconButton-root': {
        color: 'white',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
        },
      },
      '& .MuiInputBase-root': {
        color: 'white',
        borderBottom: '1px solid white',
      },
    },
  };
});

export default useStyles;
