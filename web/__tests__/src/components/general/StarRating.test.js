import renderer from 'react-test-renderer';
import StarRating from '../../../../src/components/general/StarRating';

describe('star rating', () => {
  it('rounds up to nearest half star', () => {
    const component = renderer.create(
      <StarRating rating={4.75} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('rounds down to nearest half star', () => {
    const component = renderer.create(
      <StarRating rating={3.24} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('works with more stars and other rating ratios', () => {
    const component = renderer.create(
      <StarRating rating={42} maxRating={100} starCount={20} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
