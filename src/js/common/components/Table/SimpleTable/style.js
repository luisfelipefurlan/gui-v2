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
    lines: {
      fontFamily: 'monospace',
      padding: '14px 5px',
      fontSize: '1rem',
    },
    head: {
      fontWeight: 'normal',
      fontSize: '0.8rem',
      fontFamily: '"Raleway", "Roboto", "Helvetica", "sans-serif"',
      lineHeight: '24px',
      textTransform: 'none',
      textAlign: 'center',
      color: '#6b7288',
      backgroundColor: theme.palette.table.head,
      userSelect: 'none',
    },
  };
});

export default useStyles;
