/**
 * 
 */
package edu.upenn.cis573.friends;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Test;

/**
 * @author shashank
 *
 */
public class FindClassmatesTest {

	/**
	 * I am taking no classes
	 */
	@Test
	public void testNoClasses() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				if (arg.equals("Class")) {
					return new ClassesDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("Shash")) {
								return new ArrayList<String>() {
								};
							}
							return null;
						}
					};
				}
				if (arg.equals("Student")) {
					return new StudentsDataSource() {
						public List<String> get(String arg) {
							return null;
						}
					};

				}
				return null;
			}
		};
		List<String> classmates = ff.findClassmates("Shash");
		assertEquals(null, classmates);
	}

	/**
	 * I am taking one or more classes, but no other student is in those classes
	 */
	@Test
	public void testNoClassmatesInClasses() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				if (arg.equals("Class")) {
					return new ClassesDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("Shash")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							return null;
						}
					};
				}
				if (arg.equals("Student")) {
					return new StudentsDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("CIS573"))
								return new ArrayList<String>(Arrays.asList("Shash"));
							if (arg.equals("CIS550"))
								return new ArrayList<String>(Arrays.asList("Shash"));
							return null;
						}
					};

				}
				return null;
			}
		};
		List<String> classmates = ff.findClassmates("Shash");
		assertEquals(null, classmates);
	}

	/**
	 * I am taking two or more classes; one or more other students are taking a
	 * non-empty subset of the classes I am taking
	 */
	@Test
	public void testNonEmptyClassmate() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				if (arg.equals("Class")) {
					return new ClassesDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("Shash")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							if (arg.equals("Vlad")) {
								return new ArrayList<String>(Arrays.asList("CIS800", "CIS550"));
							}
							return null;
						}
					};
				}
				if (arg.equals("Student")) {
					return new StudentsDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("CIS573"))
								return new ArrayList<String>(Arrays.asList("Shash"));
							if (arg.equals("CIS550"))
								return new ArrayList<String>(Arrays.asList("Shash", "Vlad"));
							if (arg.equals("CIS800"))
								return new ArrayList<String>(Arrays.asList("Vlad"));
							return null;
						}
					};

				}
				return null;
			}
		};
		List<String> classmates = ff.findClassmates("Shash");
		assertEquals(null, classmates);
	}

	/**
	 * I am taking two or more classes; exactly one other student is taking the
	 * exact same set of classes; one or more other students are taking a
	 * non-empty subset of the classes I am taking
	 */
	@Test
	public void testExactlyOneClassmate() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				if (arg.equals("Class")) {
					return new ClassesDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("Shash")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							if (arg.equals("Vlad")) {
								return new ArrayList<String>(Arrays.asList("CIS800", "CIS550"));
							}
							if (arg.equals("Tiago")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							return null;
						}
					};
				}
				if (arg.equals("Student")) {
					return new StudentsDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("CIS573"))
								return new ArrayList<String>(Arrays.asList("Shash", "Tiago"));
							if (arg.equals("CIS550"))
								return new ArrayList<String>(Arrays.asList("Shash", "Vlad", "Tiago"));
							if (arg.equals("CIS800"))
								return new ArrayList<String>(Arrays.asList("Vlad"));
							return null;
						}
					};

				}
				return null;
			}
		};
		List<String> classmates = ff.findClassmates("Shash");
		List<String> expectedClassmates = new ArrayList<String>(Arrays.asList("Tiago"));
		assertEquals(expectedClassmates, classmates);
		assertEquals(expectedClassmates.size(), classmates.size());
	}

	/**
	 * I am taking two or more classes; two or more other students are taking
	 * the exact same classes as I am; one or more other students are taking a
	 * non-empty subset of the classes I am taking
	 */
	@Test
	public void testExactlyTwoClassmates() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				if (arg.equals("Class")) {
					return new ClassesDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("Shash")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							if (arg.equals("Vlad")) {
								return new ArrayList<String>(Arrays.asList("CIS800", "CIS550"));
							}
							if (arg.equals("Tiago")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							if (arg.equals("Stacy")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							return null;
						}
					};
				}
				if (arg.equals("Student")) {
					return new StudentsDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("CIS573"))
								return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Stacy"));
							if (arg.equals("CIS550"))
								return new ArrayList<String>(Arrays.asList("Shash", "Vlad", "Tiago", "Stacy"));
							if (arg.equals("CIS800"))
								return new ArrayList<String>(Arrays.asList("Vlad"));
							return null;
						}
					};

				}
				return null;
			}
		};
		List<String> classmates = ff.findClassmates("Shash");
		List<String> expectedClassmates = new ArrayList<String>(Arrays.asList("Tiago", "Stacy"));
		assertEquals(expectedClassmates, classmates);
		assertEquals(expectedClassmates.size(), classmates.size());
	}

	/**
	 * I am taking two or more classes; two or more other students are taking a
	 * proper superset of the classes I am taking; one or more other students
	 * are taking a non- empty subset of the classes I am taking
	 */
	@Test
	public void testExactlyTwoSuperSetClassmates() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				if (arg.equals("Class")) {
					return new ClassesDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("Shash")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							if (arg.equals("Vlad")) {
								return new ArrayList<String>(Arrays.asList("CIS800", "CIS550"));
							}
							if (arg.equals("Tiago")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550", "CIS502"));
							}
							if (arg.equals("Stacy")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550", "CIS502"));
							}
							return null;
						}
					};
				}
				if (arg.equals("Student")) {
					return new StudentsDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("CIS573"))
								return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Stacy"));
							if (arg.equals("CIS550"))
								return new ArrayList<String>(Arrays.asList("Shash", "Vlad", "Tiago", "Stacy"));
							if (arg.equals("CIS800"))
								return new ArrayList<String>(Arrays.asList("Vlad"));
							if (arg.equals("CIS502"))
								return new ArrayList<String>(Arrays.asList("Tiago", "Stacy"));
							return null;
						}
					};

				}
				return null;
			}
		};
		List<String> classmates = ff.findClassmates("Shash");
		List<String> expectedClassmates = new ArrayList<String>(Arrays.asList("Tiago", "Stacy"));
		assertEquals(expectedClassmates, classmates);
		assertEquals(expectedClassmates.size(), classmates.size());
	}

	/**
	 * I am taking two or more classes; two or more other students are taking
	 * the exact same classes as I am; two or more other students are taking a
	 * proper superset of the classes I am taking; one or more other students
	 * are taking a non-empty subset of the classes I am taking
	 */
	@Test
	public void testFourClassmates() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				if (arg.equals("Class")) {
					return new ClassesDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("Shash")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							if (arg.equals("Kacy")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							if (arg.equals("Macy")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550"));
							}
							if (arg.equals("Vlad")) {
								return new ArrayList<String>(Arrays.asList("CIS800", "CIS550"));
							}
							if (arg.equals("Tiago")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550", "CIS502"));
							}
							if (arg.equals("Stacy")) {
								return new ArrayList<String>(Arrays.asList("CIS573", "CIS550", "CIS502"));
							}
							return null;
						}
					};
				}
				if (arg.equals("Student")) {
					return new StudentsDataSource() {
						public List<String> get(String arg) {
							if (arg.equals("CIS573"))
								return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Stacy", "Kacy", "Macy"));
							if (arg.equals("CIS550"))
								return new ArrayList<String>(
										Arrays.asList("Shash", "Vlad", "Tiago", "Stacy", "Kacy", "Macy"));
							if (arg.equals("CIS800"))
								return new ArrayList<String>(Arrays.asList("Vlad"));
							if (arg.equals("CIS502"))
								return new ArrayList<String>(Arrays.asList("Tiago", "Stacy"));
							return null;
						}
					};

				}
				return null;
			}
		};
		List<String> classmates = ff.findClassmates("Shash");
		List<String> expectedClassmates = new ArrayList<String>(Arrays.asList("Tiago", "Stacy","Kacy","Macy"));
		assertEquals(expectedClassmates, classmates);
		assertEquals(expectedClassmates.size(), classmates.size());
	}

}
