import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithFormik } from '../../testUtils/formikRender';
import ProfileHeader from '.';
import { ProfileHeaderReduxProps } from './ProfileHeader-redux';
import { getBlankInitialState, renderWithRouterRedux } from '../../testUtils/reduxRender';
import { blankUser } from '../../templates';

const defaultProps: ProfileHeaderReduxProps = {
  onChange: jest.fn(),
  isOwnPage: true,
  userDisplayName: 'The Other',
};

function renderProfileHeader(props?: ProfileHeaderReduxProps) {
  return renderWithRouterRedux(
    renderWithFormik(<ProfileHeader {...defaultProps} {...props} />, 'testItem', 'testValue'),
    { initialState: { ...getBlankInitialState(), auth: { user: blankUser, loading: false } } }
  );
}

describe('<ProfileHeader />', () => {
  it('renders without crashing', () => {
    renderProfileHeader();
  });

  describe('when visiting own profile', () => {
    describe('with public access enabled', () => {
      it('does not tell you your own name', () => {
        renderProfileHeader();
        expect(screen.getByText(/Your Profile/)).toBeInTheDocument();
      });

      it('offers a switch to turn the profile public or not', () => {
        renderProfileHeader();
        expect(screen.getByRole('switch')).toBeInTheDocument();
      });
    });

    describe('public toggle', () => {
      it('calls the API when clicked', async () => {
        renderProfileHeader();

        const toggleSwitch = screen.getByRole('switch');
        userEvent.click(toggleSwitch);

        await waitFor(() => expect(toggleSwitch).toHaveAttribute('aria-checked', 'true'));
      });
    });
  });

  describe("when visiting another user's profile", () => {
    const userDisplayName = 'Big Daniel';
    const props: ProfileHeaderReduxProps = { ...defaultProps, isOwnPage: false, userDisplayName };

    it('does not allow you to decide if their profile is visible', () => {
      renderProfileHeader(props);
      expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    });

    it('uses their name', () => {
      renderProfileHeader(props);
      expect(screen.getByText(`${userDisplayName}'s Profile`)).toBeInTheDocument();
    });
  });
});
