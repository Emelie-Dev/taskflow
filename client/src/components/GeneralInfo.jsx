import React, { useContext, useEffect, useMemo, useState } from 'react';
import styles from '../styles/GeneralInfo.module.css';
import { toast } from 'react-toastify';
import { apiClient, AuthContext } from '../App';
import { SiKashflow } from 'react-icons/si';

const customId = 'toast-id';

const GeneralInfo = () => {
  const { userData, setUserData, mode } = useContext(AuthContext);

  const [initialValue, setInitialValue] = useState({
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    username: userData.username || '',
    occupation: userData.occupation || '',
    email: userData.email || '',
    mobileNumber: userData.mobileNumber || '',
    country: userData.country || '',
    language: userData.language || '',
  });
  const [inputValue, setInputValue] = useState(initialValue);
  const [enableBtn, setEnableBtn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let count = 0;

    for (let prop in inputValue) {
      String(inputValue[prop]).trim() === String(initialValue[prop]).trim() &&
        count++;
    }

    count !== 8 ? setEnableBtn(true) : setEnableBtn(false);
  }, [inputValue]);

  const generateData = useMemo(() => {
    const countries = [
      'Ascension Island',
      'Andorra',
      'United Arab Emirates',
      'Afghanistan',
      'Antigua & Barbuda',
      'Anguilla',
      'Albania',
      'Armenia',
      'Angola',
      'Antarctica',
      'Argentina',
      'American Samoa',
      'Austria',
      'Australia',
      'Aruba',
      'Åland Islands',
      'Azerbaijan',
      'Bosnia & Herzegovina',
      'Barbados',
      'Bangladesh',
      'Belgium',
      'Burkina Faso',
      'Bulgaria',
      'Bahrain',
      'Burundi',
      'Benin',
      'St. Barthélemy',
      'Bermuda',
      'Brunei',
      'Bolivia',
      'Caribbean Netherlands',
      'Brazil',
      'Bahamas',
      'Bhutan',
      'Bouvet Island',
      'Botswana',
      'Belarus',
      'Belize',
      'Canada',
      'Cocos (Keeling) Islands',
      'Congo - Kinshasa',
      'Central African Republic',
      'Congo - Brazzaville',
      'Switzerland',
      'Ivory Coast',
      'Cook Islands',
      'Chile',
      'Cameroon',
      'China',
      'Colombia',
      'Clipperton Island',
      'Costa Rica',
      'Cuba',
      'Cape Verde',
      'Curaçao',
      'Christmas Island',
      'Cyprus',
      'Czech Republic',
      'Germany',
      'Diego Garcia',
      'Djibouti',
      'Denmark',
      'Dominica',
      'Dominican Republic',
      'Algeria',
      'Ceuta & Melilla',
      'Ecuador',
      'Estonia',
      'Egypt',
      'Western Sahara',
      'Eritrea',
      'Spain',
      'Ethiopia',
      'European Union',
      'Finland',
      'Fiji',
      'Falkland Islands',
      'Micronesia',
      'Faroe Islands',
      'France',
      'Gabon',
      'United Kingdom',
      'Grenada',
      'Georgia',
      'French Guiana',
      'Guernsey',
      'Ghana',
      'Gibraltar',
      'Greenland',
      'Gambia',
      'Guinea',
      'Guadeloupe',
      'Equatorial Guinea',
      'Greece',
      'South Georgia & South Sandwich Islands',
      'Guatemala',
      'Guam',
      'Guinea-Bissau',
      'Guyana',
      'Hong Kong',
      'Heard & McDonald Islands',
      'Honduras',
      'Croatia',
      'Haiti',
      'Hungary',
      'Canary Islands',
      'Indonesia',
      'Ireland',
      'Israel',
      'Isle of Man',
      'India',
      'British Indian Ocean Territory',
      'Iraq',
      'Iran',
      'Iceland',
      'Italy',
      'Jersey',
      'Jamaica',
      'Jordan',
      'Japan',
      'Kenya',
      'Kyrgyzstan',
      'Cambodia',
      'Kiribati',
      'Comoros',
      'St. Kitts & Nevis',
      'North Korea',
      'South Korea',
      'Kuwait',
      'Cayman Islands',
      'Kazakhstan',
      'Laos',
      'Lebanon',
      'St. Lucia',
      'Liechtenstein',
      'Sri Lanka',
      'Liberia',
      'Lesotho',
      'Lithuania',
      'Luxembourg',
      'Latvia',
      'Libya',
      'Morocco',
      'Monaco',
      'Moldova',
      'Montenegro',
      'St. Martin',
      'Madagascar',
      'Marshall Islands',
      'North Macedonia',
      'Mali',
      'Myanmar',
      'Mongolia',
      'Macao Sar China',
      'Northern Mariana Islands',
      'Martinique',
      'Mauritania',
      'Montserrat',
      'Malta',
      'Mauritius',
      'Maldives',
      'Malawi',
      'Mexico',
      'Malaysia',
      'Mozambique',
      'Namibia',
      'New Caledonia',
      'Niger',
      'Norfolk Island',
      'Nigeria',
      'Nicaragua',
      'Netherlands',
      'Norway',
      'Nepal',
      'Nauru',
      'Niue',
      'New Zealand',
      'Oman',
      'Panama',
      'Peru',
      'French Polynesia',
      'Papua New Guinea',
      'Philippines',
      'Pakistan',
      'Poland',
      'St. Pierre & Miquelon',
      'Pitcairn Islands',
      'Puerto Rico',
      'Palestinian Territories',
      'Portugal',
      'Palau',
      'Paraguay',
      'Qatar',
      'Réunion',
      'Romania',
      'Serbia',
      'Russia',
      'Rwanda',
      'Saudi Arabia',
      'Solomon Islands',
      'Seychelles',
      'Sudan',
      'Sweden',
      'Singapore',
      'St. Helena',
      'Slovenia',
      'Svalbard & Jan Mayen',
      'Slovakia',
      'Sierra Leone',
      'San Marino',
      'Senegal',
      'Somalia',
      'Suriname',
      'South Sudan',
      'São Tomé & Príncipe',
      'El Salvador',
      'Sint Maarten',
      'Syria',
      'Eswatini',
      'Tristan Da Cunha',
      'Turks & Caicos Islands',
      'Chad',
      'French Southern Territories',
      'Togo',
      'Thailand',
      'Tajikistan',
      'Tokelau',
      'Timor-Leste',
      'Turkmenistan',
      'Tunisia',
      'Tonga',
      'Turkey',
      'Trinidad & Tobago',
      'Tuvalu',
      'Taiwan',
      'Tanzania',
      'Ukraine',
      'Uganda',
      'U.S. Outlying Islands',
      'United Nations',
      'United States',
      'Uruguay',
      'Uzbekistan',
      'Vatican City',
      'St. Vincent & the Grenadines',
      'Venezuela',
      'British Virgin Islands',
      'U.S. Virgin Islands',
      'Vietnam',
      'Vanuatu',
      'Wallis & Futuna',
      'Samoa',
      'Kosovo',
      'Yemen',
      'Mayotte',
      'South Africa',
      'Zambia',
      'Zimbabwe',
      'England',
      'Scotland',
      'Wales',
    ];

    const languages = [
      'Abkhazian',
      'Afar',
      'Afrikaans',
      'Akan',
      'Albanian',
      'Amharic',
      'Arabic',
      'Aragonese',
      'Armenian',
      'Assamese',
      'Avaric',
      'Avestan',
      'Aymara',
      'Azerbaijani',
      'Bambara',
      'Bashkir',
      'Basque',
      'Belarusian',
      'Bengali',
      'Bihari languages',
      'Bislama',
      'Bosnian',
      'Breton',
      'Bulgarian',
      'Burmese',
      'Catalan, Valencian',
      'Central Khmer',
      'Chamorro',
      'Chechen',
      'Chichewa, Chewa, Nyanja',
      'Chinese',
      'Church Slavonic, Old Bulgarian, Old Church Slavonic',
      'Chuvash',
      'Cornish',
      'Corsican',
      'Cree',
      'Croatian',
      'Czech',
      'Danish',
      'Divehi, Dhivehi, Maldivian',
      'Dutch, Flemish',
      'Dzongkha',
      'English',
      'Esperanto',
      'Estonian',
      'Ewe',
      'Faroese',
      'Fijian',
      'Finnish',
      'French',
      'Fulah',
      'Gaelic, Scottish Gaelic',
      'Galician',
      'Ganda',
      'Georgian',
      'German',
      'Gikuyu, Kikuyu',
      'Greek (Modern)',
      'Greenlandic, Kalaallisut',
      'Guarani',
      'Gujarati',
      'Haitian, Haitian Creole',
      'Hausa',
      'Hebrew',
      'Herero',
      'Hindi',
      'Hiri Motu',
      'Hungarian',
      'Icelandic',
      'Ido',
      'Igbo',
      'Indonesian',
      'Interlingua (International Auxiliary Language Association)',
      'Interlingue',
      'Inuktitut',
      'Inupiaq',
      'Irish',
      'Italian',
      'Japanese',
      'Javanese',
      'Kannada',
      'Kanuri',
      'Kashmiri',
      'Kazakh',
      'Kinyarwanda',
      'Komi',
      'Kongo',
      'Korean',
      'Kwanyama, Kuanyama',
      'Kurdish',
      'Kyrgyz',
      'Lao',
      'Latin',
      'Latvian',
      'Letzeburgesch, Luxembourgish',
      'Limburgish, Limburgan, Limburger',
      'Lingala',
      'Lithuanian',
      'Luba-Katanga',
      'Macedonian',
      'Malagasy',
      'Malay',
      'Malayalam',
      'Maltese',
      'Manx',
      'Maori',
      'Marathi',
      'Marshallese',
      'Moldovan, Moldavian, Romanian',
      'Mongolian',
      'Nauru',
      'Navajo, Navaho',
      'Northern Ndebele',
      'Ndonga',
      'Nepali',
      'Northern Sami',
      'Norwegian',
      'Norwegian Bokmål',
      'Norwegian Nynorsk',
      'Nuosu, Sichuan Yi',
      'Occitan (post 1500)',
      'Ojibwa',
      'Oriya',
      'Oromo',
      'Ossetian, Ossetic',
      'Pali',
      'Panjabi, Punjabi',
      'Pashto, Pushto',
      'Persian',
      'Polish',
      'Portuguese',
      'Quechua',
      'Romansh',
      'Rundi',
      'Russian',
      'Samoan',
      'Sango',
      'Sanskrit',
      'Sardinian',
      'Serbian',
      'Shona',
      'Sindhi',
      'Sinhala, Sinhalese',
      'Slovak',
      'Slovenian',
      'Somali',
      'Sotho, Southern',
      'South Ndebele',
      'Spanish, Castilian',
      'Sundanese',
      'Swahili',
      'Swati',
      'Swedish',
      'Tagalog',
      'Tahitian',
      'Tajik',
      'Tamil',
      'Tatar',
      'Telugu',
      'Thai',
      'Tibetan',
      'Tigrinya',
      'Tonga (Tonga Islands)',
      'Tsonga',
      'Tswana',
      'Turkish',
      'Turkmen',
      'Twi',
      'Uighur, Uyghur',
      'Ukrainian',
      'Urdu',
      'Uzbek',
      'Venda',
      'Vietnamese',
      'Volap_k',
      'Walloon',
      'Welsh',
      'Western Frisian',
      'Wolof',
      'Xhosa',
      'Yiddish',
      'Yoruba',
      'Zhuang, Chuang',
      'Zulu',
    ];

    return {
      countries: countries.map((elem, index) => (
        <option key={index} value={elem} />
      )),
      languages: languages.map((elem, index) => (
        <option key={index} value={elem} />
      )),
    };
  }, []);

  const {
    firstName,
    lastName,
    username,
    occupation,
    email,
    mobileNumber,
    country,
    language,
  } = inputValue;

  const changeHandler = (input) => (e) => {
    setInputValue({
      ...inputValue,
      [input]: e.target.value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setInputValue(initialValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length === 0) {
      return toast('Username field cannot be empty.', {
        toastId: customId,
        theme: mode,
      });
    } else if (username.length > 30) {
      return toast('Username cannot exceed 30 characters.', {
        toastId: customId,
        theme: mode,
      });
    } else if (username.match(/\W/)) {
      return toast(
        'Username must consist of letters, numbers, and underscores only.',
        {
          toastId: customId,
          theme: mode,
        }
      );
    }

    setIsProcessing(true);

    try {
      const { data } = await apiClient.patch(
        `/api/v1/users/profile`,
        inputValue
      );

      const {
        firstName,
        lastName,
        username,
        occupation,
        email,
        mobileNumber,
        country,
        language,
      } = data.data.userData;

      setIsProcessing(false);
      setUserData(data.data.userData);
      setInitialValue({
        firstName,
        lastName,
        username,
        occupation,
        email,
        mobileNumber,
        country,
        language,
      });
      setEnableBtn(false);
    } catch (err) {
      setIsProcessing(false);
      if (!err.response || !err.response.data || err.response.status === 500) {
        return toast('An error occured while saving data.', {
          toastId: 'toast-id1',
          autoClose: 2000,
          theme: mode,
        });
      } else {
        return toast(err.response.data.message, {
          toastId: 'toast-id1',
          autoClose: 2000,
          theme: mode,
        });
      }
    }
  };

  return (
    <section className={styles['section']}>
      <h1
        className={`${styles['section-head']} ${
          mode === 'dark' ? styles['dark-text'] : ''
        }`}
      >
        Profile
      </h1>

      <form
        className={styles['form']}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault();
        }}
      >
        <div className={styles['form-box']}>
          <div className={styles['input-box']}>
            <label
              className={`${styles['input-label']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="profile-firstname"
            >
              First Name:
            </label>
            <input
              className={`${styles['form-input']} ${
                mode === 'dark' ? styles['dark-input'] : ''
              }`}
              id="profile-firstname"
              value={firstName}
              onChange={changeHandler('firstName')}
            />
          </div>

          <div className={styles['input-box']}>
            <label
              className={`${styles['input-label']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="profile-lastname"
            >
              Last Name:
            </label>
            <input
              className={`${styles['form-input']} ${
                mode === 'dark' ? styles['dark-input'] : ''
              }`}
              id="profile-lastname"
              value={lastName}
              onChange={changeHandler('lastName')}
            />
          </div>
        </div>

        <div className={styles['form-box']}>
          <div className={styles['input-box']}>
            <label
              className={`${styles['input-label']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="profile-username"
            >
              Username:
            </label>
            <input
              className={`${styles['form-input']} ${
                mode === 'dark' ? styles['dark-input'] : ''
              }`}
              id="profile-username"
              value={username}
              onChange={changeHandler('username')}
            />
          </div>

          <div className={styles['input-box']}>
            <label
              className={`${styles['input-label']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="profile-occupation"
            >
              Occupation:
            </label>
            <input
              className={`${styles['form-input']} ${
                mode === 'dark' ? styles['dark-input'] : ''
              }`}
              id="profile-occupation"
              value={occupation}
              onChange={changeHandler('occupation')}
            />
          </div>
        </div>

        <div className={styles['form-box']}>
          <div className={styles['input-box']}>
            <label
              className={`${styles['input-label']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="profile-email"
            >
              Email:
            </label>
            <input
              className={`${styles['form-input']} ${
                mode === 'dark' ? styles['dark-input'] : ''
              }`}
              id="profile-email"
              value={email}
              onChange={changeHandler('email')}
            />
          </div>

          <div className={styles['input-box']}>
            <label
              className={`${styles['input-label']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="profile-number"
            >
              Phone Number:
            </label>
            <input
              type="number"
              className={`${styles['form-input']} ${
                mode === 'dark' ? styles['dark-input'] : ''
              }`}
              id="profile-number"
              value={mobileNumber}
              onChange={changeHandler('mobileNumber')}
            />
          </div>
        </div>

        <div className={styles['form-box']}>
          <div className={styles['input-box']}>
            <label
              className={`${styles['input-label']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="profile-country"
            >
              Country:
            </label>
            <input
              list="countries"
              className={`${styles['form-input']} ${
                mode === 'dark' ? styles['dark-input'] : ''
              }`}
              id="profile-country"
              value={country}
              onChange={changeHandler('country')}
            />
            <datalist id="countries">{generateData.countries}</datalist>
          </div>

          <div className={styles['input-box']}>
            <label
              className={`${styles['input-label']} ${
                mode === 'dark' ? styles['dark-word'] : ''
              }`}
              htmlFor="profile-language"
            >
              Language:
            </label>
            <input
              list="languages"
              className={`${styles['form-input']} ${
                mode === 'dark' ? styles['dark-input'] : ''
              }`}
              id="profile-language"
              value={language}
              onChange={changeHandler('language')}
            />
            <datalist id="languages">{generateData.languages}</datalist>
          </div>
        </div>

        <button
          type="submit"
          className={`${styles['submit-btn']} ${
            enableBtn ? styles['enable-btn'] : ''
          } ${isProcessing ? styles['disable-btn'] : ''}`}
          onClick={handleSubmit}
        >
          {isProcessing ? (
            <>
              <SiKashflow className={styles['saving-icon']} />
              Saving....
            </>
          ) : (
            'Save'
          )}
        </button>
        <input
          type="reset"
          className={`${styles['reset-btn']} ${
            enableBtn ? styles['enable-btn'] : ''
          }`}
          value={'Reset'}
          onClick={handleReset}
        />
      </form>
    </section>
  );
};

export default GeneralInfo;
