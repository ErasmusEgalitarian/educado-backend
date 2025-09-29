import renderer from 'react-test-renderer';
import { describe, it, expect } from '@jest/globals'
import { generateTestCourse } from '../../../../__testUtils__/courses/courseTestUtils';

// Components
import { LastEdited } from '../../../../src/components/Courses/LastEdited';
import { MemoryRouter } from "react-router-dom"

describe('last edited time', () => {
  it('shows minutes if difference is below 1 hour', () => {
    // Set lastModified to 59 minutes ago
    const course = generateTestCourse({
      dateUpdated: (new Date(Date.now() - 60 * 60 * 1000 + 1000))
    });
    const component = renderer.create(
      <MemoryRouter>
        <LastEdited course={course} key={1} />
      </MemoryRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows hours if difference is below 24 hours', () => {
    // Set lastModified to 23 hours and 59 minutes ago
    const course = generateTestCourse({
      dateUpdated: (new Date(Date.now() - 24 * 60 * 60 * 1000 + 1000))
    });
    const component = renderer.create(
      <MemoryRouter>
        <LastEdited course={course} key={1} />
      </MemoryRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows days if difference is below 1 week', () => {
    // Set lastModified to 6 days ago
    const course = generateTestCourse({
      dateUpdated: (new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1000))
    });
    const component = renderer.create(
      <MemoryRouter>
        <LastEdited course={course} key={1} />
      </MemoryRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows weeks if difference is below 30 days', () => {
    // Set lastModified to 29 days ago
    const course = generateTestCourse({
      dateUpdated: (new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 1000))
    });
    const component = renderer.create(
      <MemoryRouter>
        <LastEdited course={course} key={1} />
      </MemoryRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows months if difference is below 1 year', () => {
    // Set lastModified to 364 days ago
    const course = generateTestCourse({
      dateUpdated: (new Date(Date.now() - 365 * 24 * 60 * 60 * 1000 + 1000))
    });
    const component = renderer.create(
      <MemoryRouter>
        <LastEdited course={course} key={1} />
      </MemoryRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows fromDate if difference is above 1 year', () => {
    const testDate = new Date('1992-06-26')

    // Set lastModified to 365 days ago
    const course = generateTestCourse({
      dateUpdated: testDate
    });
    const component = renderer.create(
      <MemoryRouter>
        <LastEdited course={course} key={1} />
      </MemoryRouter>
    );
    
    const pTag = component.root.findByType('p');
    const dateValue = pTag.children[0];
    
    expect(dateValue).toBe(testDate.toLocaleDateString());
  });
});
