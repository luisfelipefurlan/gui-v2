import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    root: {
      borderRadius: 5,
      height: '100%',
    },
    gridRoot: {
      flexGrow: 1,
      padding: '0px 20px',
      paddingTop: '10px',
    },
    gridLabel: {
      color: '#000000',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      lineHeight: '24px',
      paddingBottom: '10px',
    },
    lines: {
      fontFamily: 'monospace',
      padding: '14px 5px',
      fontSize: '1rem',
    },
    head: {
      fontWeight: 'normal',
      fontSize: '0.8rem',
      fontFamily: '"Roboto", "Helvetica", "sans-serif"',
      lineHeight: '24px',
      textTransform: 'none',
      color: '#6b7288',
      backgroundColor: theme.palette.table.head,
      userSelect: 'none',
      padding: '6px 0',
    },
  };
});

export default useStyles;
