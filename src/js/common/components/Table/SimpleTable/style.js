import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    root: {
      borderRadius: 5,
      height: '100%',
      overflowY: 'hidden',
      '&:hover': {
        overflowY: 'auto',
      },
    },
    head: {
      backgroundColor: theme.palette.background.paper,
      fontWeight: 600,
      userSelect: 'none',
    },
  };
});

export default useStyles;
