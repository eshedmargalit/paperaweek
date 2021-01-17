import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithFormik } from '../../testUtils/formikRender';
import ProfileHeader, { ProfileHeaderProps } from './ProfileHeader-view';

const defaultProps: ProfileHeaderProps = {
  initialValues: { publicProfile: true },
  saveResults: jest.fn(),
  isOwnPage: true,
  userDisplayName: 'The Other',
};

function renderProfileHeader(props?: ProfileHeaderProps) {
  return renderWithFormik(<ProfileHeader {...defaultProps} {...props} />, 'testItem', 'testValue');
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
  });

  describe("when visiting another user's profile", () => {
    const userDisplayName = 'Big Daniel';
    const props: ProfileHeaderProps = { ...defaultProps, isOwnPage: false, userDisplayName };

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
