import { COLORS } from '../constants/colors';

export const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.light,
  },
  card: {
    marginVertical: 8,
    elevation: 4,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.primary,
  },
  button: {
    marginVertical: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: COLORS.dark,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
};
