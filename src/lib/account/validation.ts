function formText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().replace(/\0/g, "") : "";
}

export function profileFields(form: FormData) {
  const fullName = formText(form, "fullName");
  const company = formText(form, "company");
  const website = formText(form, "website");

  if (fullName.length < 2 || fullName.length > 80) {
    return { error: "Please enter a name between 2 and 80 characters." } as const;
  }
  if (company.length > 120) {
    return { error: "Company names can be up to 120 characters." } as const;
  }
  if (website.length > 500) {
    return { error: "Website addresses can be up to 500 characters." } as const;
  }
  if (website) {
    try {
      const url = new URL(website);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
        return { error: "Enter a public website address starting with https:// or http://." } as const;
      }
    } catch {
      return { error: "Enter a complete website address, including https://." } as const;
    }
  }

  return {
    data: { full_name: fullName, company: company || null, website: website || null },
  } as const;
}

export function projectFields(form: FormData) {
  const name = formText(form, "name");
  if (name.length < 2 || name.length > 100) {
    return { error: "Please enter a project name between 2 and 100 characters." } as const;
  }
  return { data: { name } } as const;
}

export function requestFields(form: FormData) {
  const subject = formText(form, "subject");
  const message = formText(form, "message");
  if (subject.length < 3 || subject.length > 160) {
    return { error: "Please enter a subject between 3 and 160 characters." } as const;
  }
  if (message.length < 20 || message.length > 3000) {
    return { error: "Please write a message between 20 and 3,000 characters." } as const;
  }
  return { data: { subject, message } } as const;
}
